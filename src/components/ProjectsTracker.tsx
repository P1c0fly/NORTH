import React, { useState } from 'react';
import { Compass, CheckCircle2, Calendar, DollarSign, Building, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface ProjectsTrackerProps {
  projects: Project[];
}

export const ProjectsTracker: React.FC<ProjectsTrackerProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const categories = ['الكل', 'نقل وجسور', 'أبراج وعقارات', 'واجهات بحرية وتطوير', 'بنية تحتية'];

  const filteredProjects = selectedCategory === 'الكل'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="py-6">
      {/* Header Banner */}
      <div className="bg-[#0A3641] text-white rounded-3xl p-6 sm:p-8 mb-6 border border-[#00A896]/30 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-[#00A896]/20 text-[#00A896] px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Compass className="w-4 h-4" />
            <span>رصد المشروعات الاستراتيجية والتنموية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif mb-2">
            متابعة مشاريع وبنية أبحر الشمالية التحتية
          </h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
            رصد ميداني دوري وموثوق لنسب إنجاز جسر أبحر المعلق، برج جدة ومدينة المملكة، الواجهات البحرية، وشبكات النقل وتصريف الأمطار.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-[#0A3641] text-white shadow-xs'
                : 'bg-[#F4F1EA] text-[#0A3641] hover:bg-[#FAF9F6] border border-[#0A3641]/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-[#F4F1EA] rounded-3xl overflow-hidden border border-[#0A3641]/15 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Media & Badge */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0A3641]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06232B] via-transparent to-transparent"></div>

                <div className="absolute top-4 start-4 flex items-center gap-2">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full shadow-xs ${
                      project.status === 'مكتمل'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#E06D53] text-white'
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="bg-[#0A3641]/85 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>

                <div className="absolute bottom-3 start-4 end-4 text-white">
                  <span className="text-xs text-[#00A896] font-bold block mb-1">
                    {project.neighborhood}
                  </span>
                  <h3 className="font-bold text-lg sm:text-xl font-serif leading-snug">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Progress and Details */}
              <div className="p-5 sm:p-6">
                {/* Progress Bar */}
                <div className="mb-4 bg-[#FAF9F6] p-4 rounded-2xl border border-[#0A3641]/10">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0A3641] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00A896]" />
                      <span>نسبة الإنجاز الفعلية</span>
                    </span>
                    <span className="text-base text-[#00A896] font-black">{project.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#0A3641]/10 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-l from-[#00A896] to-[#0A3641] rounded-full transition-all duration-1000"
                      style={{ width: `${project.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#0A3641]/80 leading-relaxed font-normal mb-4">
                  {project.description}
                </p>

                {/* Key Highlights */}
                {project.keyHighlights && project.keyHighlights.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <span className="text-xs font-bold text-[#0A3641] block">أبرز المكتسبات والخصائص:</span>
                    {project.keyHighlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#0A3641]/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896] shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Project Meta Footer */}
            <div className="p-5 pt-3 border-t border-[#0A3641]/10 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-3 text-xs text-[#0A3641]/70">
              {project.budget && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>الميزانية: <strong className="text-[#0A3641]">{project.budget}</strong></span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#E06D53]" />
                <span>الانتهاء المتوقع: <strong className="text-[#0A3641]">{project.completionDate}</strong></span>
              </div>

              {project.contractorOrOwner && (
                <div className="w-full flex items-center gap-1 pt-2 border-t border-[#0A3641]/5 text-[11px]">
                  <Building className="w-3.5 h-3.5 text-[#0A3641]/50" />
                  <span>الجهة المشرفة: {project.contractorOrOwner}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
