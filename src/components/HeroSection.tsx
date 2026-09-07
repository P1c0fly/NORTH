import React from 'react';
import {
  Clock,
  Eye,
  ArrowLeft,
  GraduationCap,
  Compass,
  BarChart3,
  Waves,
  ExternalLink,
} from 'lucide-react';
import { Article } from '../types';
import { BRAND_INFO } from '../data/initialData';

interface HeroSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onNavigateTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  articles,
  onSelectArticle,
  onNavigateTab,
}) => {
  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  const sideArticles = articles.filter((a) => a.id !== featuredArticle?.id).slice(0, 3);

  return (
    <section className="py-6 sm:py-8">
      {/* Brand Identity Banner (Red Sea Deep Ocean & Coastal Sand Theme) */}
      <div className="bg-gradient-to-r from-[#051C2C] via-[#0C3552] to-[#114A6F] rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-md border border-[#C29B63]/30 relative overflow-hidden">
        {/* Subtle decorative Red Sea background elements */}
        <div className="absolute -end-10 -bottom-10 w-80 h-80 bg-[#028090]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute start-1/3 -top-10 w-60 h-60 bg-[#C29B63]/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-center lg:text-start">
            <div className="inline-flex items-center gap-2 bg-[#C29B63]/20 border border-[#C29B63]/40 px-3 py-1 rounded-full text-xs font-bold text-[#F2ECE1] mb-3">
              <Waves className="w-3.5 h-3.5 text-[#028090]" />
              <span>منصة الإعلام والبيانات الرقمية الموثقة لشمال أبحر</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif leading-tight mb-2">
              أبحر الشمالية | بوابتك الإخبارية والرقمية الموثقة
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-normal mb-4">
              {BRAND_INFO.editorBio}
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <button
                onClick={() => onNavigateTab('projects-services')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-[#C29B63]/30 transition-all px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-white/20"
              >
                <Compass className="w-4 h-4 text-[#028090]" />
                <span>مشاريع وتطوير أبحر</span>
              </button>

              <button
                onClick={() => onNavigateTab('schools-directory')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-[#C29B63]/30 transition-all px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-white/20"
              >
                <GraduationCap className="w-4 h-4 text-[#C29B63]" />
                <span>دليل المدارس المعتمدة</span>
              </button>

              <button
                onClick={() => onNavigateTab('public-data')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-[#C29B63]/30 transition-all px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-white/20"
              >
                <BarChart3 className="w-4 h-4 text-teal-300" />
                <span>مؤشرات العقار والبيانات</span>
              </button>
            </div>
          </div>

          {/* Social Card Info */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center flex flex-col items-center min-w-[240px]">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] p-1 shadow-lg mb-3 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full rounded-full bg-[#0C3552] flex items-center justify-center text-[#C29B63] font-black text-lg">
                أبحر
              </div>
            </div>
            <div className="font-black text-base text-white">منصة أبحر الشمالية</div>
            <div className="text-xs text-[#028090] font-bold mb-3">{BRAND_INFO.handle}</div>
            <div className="flex items-center gap-4 text-xs text-white/70 mb-3">
              <div>
                <span className="font-bold text-white block">228K+</span>
                <span>تغطية وتفاعل</span>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div>
                <span className="font-bold text-white block">رصد حي</span>
                <span>لكل الأحياء</span>
              </div>
            </div>
            <a
              href={BRAND_INFO.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#C29B63] hover:bg-[#AC8449] text-white py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <span>تابعنا على X</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Hero Article (8 cols) */}
        {featuredArticle && (
          <div className="lg:col-span-8">
            <div
              id="hero-featured-article"
              onClick={() => onSelectArticle(featuredArticle)}
              className="group cursor-pointer bg-[#F2ECE1] rounded-3xl overflow-hidden border border-[#0C3552]/15 shadow-xs hover:shadow-md transition-all flex flex-col h-full"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0C3552]">
                <img
                  src={featuredArticle.coverImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#051C2C] via-[#051C2C]/30 to-transparent"></div>

                {/* Badges on Image */}
                <div className="absolute top-4 start-4 flex flex-wrap items-center gap-2">
                  <span className="bg-[#C29B63] text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
                    تغطية خاصة
                  </span>
                  <span className="bg-[#0C3552]/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {featuredArticle.categoryName}
                  </span>
                </div>

                {/* Headline on Image */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-serif leading-snug mb-2 group-hover:text-[#C29B63] transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 font-medium">
                    <span>{featuredArticle.author.name}</span>
                    <span>•</span>
                    <span>{featuredArticle.publishDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#028090]" />
                      <span>{featuredArticle.readTimeMinutes} دقائق قراءة</span>
                    </span>
                    <span className="flex items-center gap-1 ms-auto">
                      <Eye className="w-3.5 h-3.5 text-[#C29B63]" />
                      <span>{featuredArticle.views} مشاهدة</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Bottom */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <p className="text-sm sm:text-base text-[#0C3552]/80 leading-relaxed font-normal line-clamp-2 mb-4">
                  {featuredArticle.summary}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[#0C3552]/10 text-xs font-bold text-[#028090] group-hover:text-[#C29B63] transition-colors">
                  <span className="flex items-center gap-1.5">
                    <span>اقرأ التقرير الكامل والبيانات الميدانية</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </span>
                  <div className="flex items-center gap-1 text-[#0C3552]/60">
                    {featuredArticle.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="bg-[#FAF8F5] px-2 py-0.5 rounded text-[11px]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Side Top Stories (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#0C3552]">
            <h3 className="font-black text-lg text-[#0C3552] font-serif">مستجدات مهمة</h3>
            <span className="text-xs font-bold text-[#C29B63]">تحديثات دورية</span>
          </div>

          <div className="flex flex-col gap-3.5 flex-1">
            {sideArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="group cursor-pointer bg-[#F2ECE1] hover:bg-[#e9e2d5] p-4 rounded-2xl border border-[#0C3552]/10 transition-all flex gap-3.5 items-start"
              >
                <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-[#0C3552]">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-[#028090] block mb-1 truncate">
                    {art.categoryName}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0C3552] leading-snug group-hover:text-[#C29B63] transition-colors line-clamp-2 mb-1.5">
                    {art.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#0C3552]/60">
                    <span>{art.publishDate}</span>
                    <span>•</span>
                    <span>{art.readTimeMinutes} د قراءة</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Hub Stats Card */}
          <div className="bg-[#0C3552] text-white p-4 rounded-2xl border border-[#C29B63]/30 flex items-center justify-between shadow-xs">
            <div>
              <div className="text-xs text-[#028090] font-bold">جسر أبحر المعلق 2026</div>
              <div className="text-xl font-black font-serif">82.4% نسبة الإنجاز</div>
            </div>
            <button
              onClick={() => onNavigateTab('projects-services')}
              className="text-xs bg-[#C29B63] hover:bg-[#AC8449] text-white px-3 py-1.5 rounded-lg font-bold transition-colors"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
