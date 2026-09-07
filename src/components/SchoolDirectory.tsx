import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  Phone,
  MapPin,
  Star,
  Download,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
} from 'lucide-react';
import { School, DataTableData } from '../types';
import { DataTableEmbed } from './DataTableEmbed';
import { exportToCsv, exportToExcel } from '../utils/excel';

interface SchoolDirectoryProps {
  schools: School[];
}

export const SchoolDirectory: React.FC<SchoolDirectoryProps> = ({ schools }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('الكل');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('الكل');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Extract unique neighborhoods
  const neighborhoods = useMemo(() => {
    const set = new Set(schools.map((s) => s.neighborhood));
    return ['الكل', ...Array.from(set)];
  }, [schools]);

  const schoolTypes = ['الكل', 'عالمي', 'أهلي', 'حكومي', 'حضانة ورياض أطفال'];

  const filteredSchools = useMemo(() => {
    return schools.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.curriculum.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = selectedType === 'الكل' || s.type === selectedType;
      const matchNeighborhood =
        selectedNeighborhood === 'الكل' || s.neighborhood === selectedNeighborhood;

      return matchSearch && matchType && matchNeighborhood;
    });
  }, [schools, searchTerm, selectedType, selectedNeighborhood]);

  // Convert schools to DataTableData for table view & Excel export
  const schoolsTableData: DataTableData = useMemo(() => {
    return {
      id: 'schools_export',
      title: 'دليل مدارس أبحر الشمالية 2026',
      headers: ['اسم المدرسة', 'النوع', 'الجنس', 'المراحل', 'الحي', 'المنهج', 'متوسط الرسوم', 'الهاتف'],
      rows: filteredSchools.map((s) => [
        s.name,
        s.type,
        s.gender,
        s.stages.join('، '),
        s.neighborhood,
        s.curriculum,
        s.feesRange,
        s.phone,
      ]),
      source: 'منصة أبحر الشمالية @Northabhor',
      updatedAt: new Date().toLocaleDateString('ar-SA'),
    };
  }, [filteredSchools]);

  return (
    <div className="py-6">
      {/* Header Banner */}
      <div className="bg-[#0A3641] text-white rounded-3xl p-6 sm:p-8 mb-6 border border-[#00A896]/30 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#00A896]/20 text-[#00A896] px-3 py-1 rounded-full text-xs font-bold mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>المنظومة التعليمية المتكاملة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif mb-2">
              دليل المدارس والمؤسسات التعليمية بأبحر الشمالية
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl font-normal">
              دليل أولياء الأمور الشامل للمدارس العالمية والأهلية والحكومية والحضانات في أحياء الياقوت والشراع والصواري والفردوس والأمواج.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                exportToExcel(
                  schoolsTableData.title,
                  schoolsTableData.headers,
                  schoolsTableData.rows
                )
              }
              className="inline-flex items-center gap-1.5 bg-[#00A896] hover:bg-[#008f80] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الدليل (Excel)</span>
            </button>
            <button
              onClick={() =>
                exportToCsv(
                  schoolsTableData.title,
                  schoolsTableData.headers,
                  schoolsTableData.rows
                )
              }
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors border border-white/20"
            >
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#F4F1EA] p-4 sm:p-5 rounded-2xl border border-[#0A3641]/10 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="ابحث باسم المدرسة، المنهج، أو الحي..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF9F6] border border-[#0A3641]/20 rounded-xl py-2 ps-10 pe-4 text-xs sm:text-sm text-[#0A3641] focus:outline-none focus:ring-2 focus:ring-[#00A896]"
          />
          <Search className="w-4 h-4 text-[#0A3641]/50 absolute start-3 top-3" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* School Type Filter */}
          <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#0A3641]/15 text-xs overflow-x-auto">
            {schoolTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-[#0A3641] text-white shadow-xs'
                    : 'text-[#0A3641] hover:bg-[#F4F1EA]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Neighborhood Selector */}
          <div className="flex items-center gap-1.5 bg-[#FAF9F6] px-3 py-1.5 rounded-xl border border-[#0A3641]/15 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#00A896]" />
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="bg-transparent text-[#0A3641] font-semibold focus:outline-none cursor-pointer"
            >
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n === 'الكل' ? 'كافة الأحياء' : n}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#0A3641]/15 text-xs ms-auto md:ms-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards' ? 'bg-[#0A3641] text-white' : 'text-[#0A3641]'
              }`}
              title="عرض البطاقات"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-[#0A3641] text-white' : 'text-[#0A3641]'
              }`}
              title="عرض الجدول التفاعلي"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results View */}
      {viewMode === 'table' ? (
        <DataTableEmbed data={schoolsTableData} allowExport={false} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="bg-[#F4F1EA] rounded-2xl p-5 border border-[#0A3641]/15 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Type and Rating */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-md ${
                      school.type === 'عالمي'
                        ? 'bg-[#00A896] text-white'
                        : school.type === 'أهلي'
                        ? 'bg-[#0A3641] text-white'
                        : 'bg-[#E06D53] text-white'
                    }`}
                  >
                    {school.type}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#0A3641]">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{school.rating}</span>
                    <span className="text-[#0A3641]/50">({school.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-[#0A3641] mb-2 font-serif leading-snug">
                  {school.name}
                </h3>

                <div className="space-y-2 text-xs text-[#0A3641]/80 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E06D53] shrink-0" />
                    <span className="font-semibold text-[#0A3641]">{school.neighborhood}</span>
                    <span className="text-[#0A3641]/50">({school.address})</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896] shrink-0" />
                    <span>المنهج: <strong className="text-[#0A3641]">{school.curriculum}</strong></span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    <span className="text-[#0A3641]/60">المراحل:</span>
                    {school.stages.map((stage, idx) => (
                      <span key={idx} className="bg-[#FAF9F6] text-[#0A3641] px-2 py-0.5 rounded text-[10px] font-medium border border-[#0A3641]/10">
                        {stage}
                      </span>
                    ))}
                    <span className="bg-[#FAF9F6] text-[#00A896] px-2 py-0.5 rounded text-[10px] font-bold border border-[#00A896]/20">
                      {school.gender}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Fees and Contact */}
              <div className="pt-3 border-t border-[#0A3641]/10 flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[11px] text-[#0A3641]/60 block">الرسوم التقديرية</span>
                  <span className="font-bold text-[#0A3641]">{school.feesRange}</span>
                </div>

                <a
                  href={`tel:${school.phone}`}
                  className="inline-flex items-center gap-1 bg-[#0A3641] hover:bg-[#E06D53] text-white px-3 py-1.5 rounded-xl font-bold transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>اتصال</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredSchools.length === 0 && (
        <div className="bg-[#F4F1EA] p-8 rounded-2xl text-center text-[#0A3641]/70">
          لم يتم العثور على مدارس مطابقة لمعايير البحث الحالية. يمكنك تجربة كلمات بحث أخرى أو تغيير تصفية الأحياء.
        </div>
      )}
    </div>
  );
};
