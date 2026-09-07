import React, { useState, useMemo } from 'react';
import { Search, Download, ArrowUpDown, FileSpreadsheet, ChevronRight, ChevronLeft } from 'lucide-react';
import { DataTableData } from '../types';
import { exportToCsv, exportToExcel } from '../utils/excel';

interface DataTableEmbedProps {
  data: DataTableData;
  allowExport?: boolean;
}

export const DataTableEmbed: React.FC<DataTableEmbedProps> = ({ data, allowExport = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColIndex, setSortColIndex] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const handleSort = (index: number) => {
    if (sortColIndex === index) {
      setSortAsc(!sortAsc);
    } else {
      setSortColIndex(index);
      setSortAsc(true);
    }
  };

  const filteredRows = useMemo(() => {
    if (!data.rows) return [];
    let rows = data.rows;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      rows = rows.filter((row) =>
        row.some((cell) => String(cell).toLowerCase().includes(term))
      );
    }

    if (sortColIndex !== null) {
      rows = [...rows].sort((a, b) => {
        const valA = a[sortColIndex];
        const valB = b[sortColIndex];

        // Numeric comparison if both are numbers or numeric strings
        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortAsc ? numA - numB : numB - numA;
        }

        return sortAsc
          ? String(valA).localeCompare(String(valB), 'ar')
          : String(valB).localeCompare(String(valA), 'ar');
      });
    }

    return rows;
  }, [data.rows, searchTerm, sortColIndex, sortAsc]);

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-[#FAF9F6] border border-[#0A3641]/15 rounded-2xl overflow-hidden shadow-xs my-6">
      {/* Table Header Controls */}
      <div className="p-4 bg-[#F4F1EA] border-b border-[#0A3641]/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-[#0A3641] flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#00A896]" />
            <span>{data.title}</span>
          </h4>
          {data.source && (
            <span className="text-xs text-[#0A3641]/60 block mt-0.5">
              المصدر: {data.source} {data.updatedAt && `• ${data.updatedAt}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ms-auto flex-wrap">
          {/* In-table Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="بحث في الجدول..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="bg-[#FAF9F6] border border-[#0A3641]/20 rounded-lg py-1.5 ps-8 pe-3 text-xs text-[#0A3641] focus:outline-none focus:ring-1 focus:ring-[#00A896]"
            />
            <Search className="w-3.5 h-3.5 text-[#0A3641]/40 absolute start-2.5 top-2.5" />
          </div>

          {/* Export Buttons */}
          {allowExport && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => exportToExcel(data.title, data.headers, data.rows)}
                className="inline-flex items-center gap-1 bg-[#0A3641] hover:bg-[#06232B] text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                title="تصدير بصيغة إكسل"
              >
                <Download className="w-3.5 h-3.5 text-[#00A896]" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => exportToCsv(data.title, data.headers, data.rows)}
                className="inline-flex items-center gap-1 bg-[#FAF9F6] border border-[#0A3641]/20 hover:bg-[#F4F1EA] text-[#0A3641] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                title="تصدير بصيغة CSV"
              >
                <span>CSV</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs sm:text-sm">
          <thead className="bg-[#0A3641] text-white font-bold text-xs uppercase">
            <tr>
              {data.headers.map((header, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(idx)}
                  className="py-3 px-4 text-start cursor-pointer hover:bg-[#06232B] transition-colors select-none whitespace-nowrap"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{header}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0A3641]/10 bg-white">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#F4F1EA]/60 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-3 px-4 text-[#0A3641] font-medium whitespace-nowrap">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={data.headers.length} className="py-6 text-center text-[#0A3641]/60">
                  لا توجد نتائج مطابقة لعملية البحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 bg-[#F4F1EA] border-t border-[#0A3641]/10 flex items-center justify-between text-xs text-[#0A3641]/70">
          <div>
            إجمالي السجلات: <span className="font-bold text-[#0A3641]">{filteredRows.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded bg-[#FAF9F6] border border-[#0A3641]/15 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-[#0A3641]">
              {page} من {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded bg-[#FAF9F6] border border-[#0A3641]/15 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
