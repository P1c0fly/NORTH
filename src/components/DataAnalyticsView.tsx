import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Building,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CommunityMetric, RealEstateIndex } from '../types';
import { exportToCsv, exportToExcel } from '../utils/excel';

interface DataAnalyticsViewProps {
  metrics: CommunityMetric[];
  stats: RealEstateIndex[];
}

export const DataAnalyticsView: React.FC<DataAnalyticsViewProps> = ({ metrics, stats }) => {
  const exportRealEstate = (format: 'excel' | 'csv') => {
    const headers = [
      'الحي السكني',
      'متوسط سعر المتر السكني (ريال)',
      'متوسط سعر المتر التجاري (ريال)',
      'نسبة التغير السنوي',
      'مستوى الإقبال والطلب',
      'أعلى نوع عقار طلباً',
    ];
    const rows = stats.map((s) => [
      s.neighborhood,
      s.averageMeterPriceResidential,
      s.averageMeterPriceCommercial,
      `+${s.yearlyChangePercentage}%`,
      s.activityLevel,
      s.topDemandType,
    ]);

    if (format === 'excel') {
      exportToExcel('مؤشرات عقارات أبحر الشمالية 2026', headers, rows);
    } else {
      exportToCsv('مؤشرات عقارات أبحر الشمالية 2026', headers, rows);
    }
  };

  return (
    <div className="py-6">
      {/* Header Banner */}
      <div className="bg-[#0A3641] text-white rounded-3xl p-6 sm:p-8 mb-8 border border-[#00A896]/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#00A896]/20 text-[#00A896] px-3 py-1 rounded-full text-xs font-bold mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>البيانات والإحصاءات المفتوحة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif mb-2">
              مرصد البيانات والمؤشرات العقارية لأبحر الشمالية
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl font-normal">
              تحليل دوري معتمد لأسعار العقارات السكنية والتجارية، معدلات النمو، وكثافة الخدمات العامة في كافة مخططات وأحياء أبحر.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => exportRealEstate('excel')}
              className="inline-flex items-center gap-1.5 bg-[#00A896] hover:bg-[#008f80] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>تصدير البيانات (Excel)</span>
            </button>
            <button
              onClick={() => exportRealEstate('csv')}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors border border-white/20"
            >
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.id}
            className="bg-[#F4F1EA] p-5 rounded-2xl border border-[#0A3641]/15 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#0A3641]/70 block mb-1">{m.title}</span>
              <div className="text-2xl sm:text-3xl font-black font-serif text-[#0A3641] mb-2">
                {m.value}
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#00A896] bg-[#00A896]/10 px-2 py-0.5 rounded-md mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{m.change}</span>
              </div>
              <p className="text-[11px] text-[#0A3641]/60 leading-normal">{m.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Real Estate Neighborhoods Index Table & Visualizer */}
      <div className="bg-[#F4F1EA] rounded-3xl p-5 sm:p-7 border border-[#0A3641]/15 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0A3641] font-serif flex items-center gap-2">
              <Building className="w-5 h-5 text-[#00A896]" />
              <span>مؤشر أسعار المتر السكني والتجاري حسب الأحياء (2026)</span>
            </h3>
            <p className="text-xs text-[#0A3641]/70 mt-1">
              محدث وفق الرصد الدوري والصفقات الموثقة في البورصة العقارية لمنطقة أبحر الشمالية
            </p>
          </div>
          <span className="text-xs font-bold text-[#E06D53] bg-[#E06D53]/10 px-3 py-1 rounded-full w-fit">
            مؤشر الربع الثالث
          </span>
        </div>

        {/* Visual Bar Comparison */}
        <div className="space-y-4 mb-8">
          {stats.map((item, idx) => {
            const maxPrice = 5000;
            const resWidth = Math.min(100, Math.round((item.averageMeterPriceResidential / maxPrice) * 100));
            return (
              <div key={idx} className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#0A3641]/10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0A3641]">{item.neighborhood}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        item.activityLevel === 'مرتفع جداً'
                          ? 'bg-[#E06D53] text-white'
                          : 'bg-[#00A896] text-white'
                      }`}
                    >
                      إقبال {item.activityLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[#0A3641]">
                      السكني: <strong className="text-base font-bold font-serif">{item.averageMeterPriceResidential.toLocaleString()}</strong> ريال/م²
                    </span>
                    <span className="text-[#0A3641]/60 hidden sm:inline">|</span>
                    <span className="text-[#0A3641]/80 hidden sm:inline">
                      التجاري: <strong>{item.averageMeterPriceCommercial.toLocaleString()}</strong> ريال/م²
                    </span>
                    <span className="text-[#00A896] font-bold">+{item.yearlyChangePercentage}%</span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full h-2.5 bg-[#0A3641]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-[#00A896] to-[#0A3641] rounded-full"
                    style={{ width: `${resWidth}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#0A3641]/60 mt-1.5">
                  <span>الأكثر طلباً: {item.topDemandType}</span>
                  <span>النمو السنوي: {item.yearlyChangePercentage}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Note */}
        <div className="bg-[#0A3641] text-white p-4 rounded-2xl flex items-center gap-3 text-xs">
          <Sparkles className="w-5 h-5 text-[#00A896] shrink-0" />
          <p className="leading-relaxed">
            يتم تحديث هذه المؤشرات والتحليلات البيانية دورياً بالتعاون مع خبراء التثمين العقاري والمتابعة الميدانية لـ <strong>@Northabhor</strong> لتوفير مرجع موثوق للمستثمرين والعائلات.
          </p>
        </div>
      </div>
    </div>
  );
};
