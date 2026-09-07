import * as XLSX from 'xlsx';
import { DataTableData } from '../types';

/**
 * Parses an Excel or CSV file buffer into a structured DataTableData object.
 * Fully supports Arabic UTF-8 text and right-to-left content.
 */
export async function parseExcelOrCsv(file: File): Promise<DataTableData> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, {
    type: 'array',
    cellDates: true,
    cellNF: false,
    cellText: false,
  });

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to array of arrays
  const rawData = XLSX.utils.sheet_to_json<(string | number)[]>(worksheet, {
    header: 1,
    defval: '',
    blankrows: false,
  });

  if (!rawData || rawData.length === 0) {
    throw new Error('الملف فارغ أو يتعذر قراءته');
  }

  // First non-empty row as header
  const headers = (rawData[0] || []).map((h) => String(h || '').trim());
  const rows = rawData.slice(1).filter((row) => row.some((cell) => cell !== '' && cell !== null && cell !== undefined));

  return {
    id: 'table_' + Date.now(),
    title: file.name.replace(/\.[^/.]+$/, ''),
    headers,
    rows,
    updatedAt: new Date().toLocaleDateString('ar-SA'),
    source: 'ملف مرفوع: ' + file.name,
  };
}

/**
 * Exports data to an Excel (.xlsx) file and triggers browser download
 */
export function exportToExcel(
  fileName: string,
  headers: string[],
  rows: (string | number)[][],
  sheetName: string = 'بيانات أبحر الشمالية'
) {
  const worksheetData = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set Right-to-Left sheet view
  if (!worksheet['!views']) worksheet['!views'] = [];
  worksheet['!views'].push({ rightToLeft: true });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * Exports data to a CSV file with BOM for Arabic Excel compatibility
 */
export function exportToCsv(fileName: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  // Add UTF-8 BOM so Excel opens Arabic correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
