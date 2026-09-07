import React, { useState } from 'react';
import { ExternalLink, Waves, ShieldCheck } from 'lucide-react';
import { BRAND_INFO, NEIGHBORHOODS } from '../data/initialData';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenAdmin }) => {
  const [clickCount, setClickCount] = useState(0);

  // Hidden admin access: 3 clicks on the subtle coastal emblem
  const handleSecretClick = () => {
    const nextCount = clickCount + 1;
    if (nextCount >= 3) {
      setClickCount(0);
      onOpenAdmin();
    } else {
      setClickCount(nextCount);
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  return (
    <footer className="bg-[#051C2C] text-white pt-12 pb-8 border-t-2 border-[#C29B63]/30 mt-16 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          {/* Brand & Editorial Bio (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0C3552] border border-[#C29B63]/40 flex items-center justify-center text-[#C29B63] font-black text-xl shadow-xs">
                أبحر
              </div>
              <div>
                <span className="font-black text-lg text-white font-serif block">
                  {BRAND_INFO.name}
                </span>
                <span className="text-xs text-[#028090] font-bold">{BRAND_INFO.handle}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal">
              {BRAND_INFO.editorBio}
            </p>

            {/* Twitter Banner CTA */}
            <div className="bg-[#0C3552] p-4 rounded-2xl border border-[#C29B63]/20 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white block">حساب الرصد والمجتمع الموثق</span>
                <span className="text-[11px] text-[#C29B63]">تغطيات ميدانية وتفاعل يومي</span>
              </div>
              <a
                href={BRAND_INFO.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C29B63] hover:bg-[#AC8449] text-white px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
              >
                <span>تابعنا على X</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-sm text-[#C29B63] font-serif uppercase tracking-wider">
              أقسام المنصة
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80 font-medium">
              <li>
                <button
                  onClick={() => onNavigateTab('news-development')}
                  className="hover:text-[#C29B63] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#028090]"></span>
                  <span>أخبار وتطوير أبحر</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('schools-directory')}
                  className="hover:text-[#C29B63] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#028090]"></span>
                  <span>دليل المدارس المعتمدة</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('projects-services')}
                  className="hover:text-[#C29B63] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#028090]"></span>
                  <span>مشاريع وتطوير البنية التحتية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('public-data')}
                  className="hover:text-[#C29B63] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#028090]"></span>
                  <span>مرصد البيانات والعقارات</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Neighborhoods of North Obhur (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-sm text-[#C29B63] font-serif uppercase tracking-wider">
              أحياء ومخططات أبحر الشمالية
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {NEIGHBORHOODS.map((n, idx) => (
                <span
                  key={idx}
                  className="bg-[#0C3552] text-white/90 text-[11px] px-2.5 py-1 rounded-lg border border-white/10"
                >
                  {n}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-white/60 leading-normal pt-1">
              تغطية ومتابعة مستمرة لكافة الخدمات، البنية التحتية، والمشروعات في شمال جدة.
            </p>
          </div>
        </div>

        {/* Copyright and Discrete Admin Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} لمنصة <strong>{BRAND_INFO.name}</strong> ({BRAND_INFO.handle})
          </div>
          <div className="flex items-center gap-3">
            <span>البوابة الرقمية الموثقة لأبحر الشمالية - جدة</span>
            <span>•</span>
            {/* Secret discreet trigger: clicking 3 times opens Admin Panel */}
            <button
              onClick={handleSecretClick}
              title="رصد ساحل البحر الأحمر"
              className="inline-flex items-center gap-1 text-[#C29B63] hover:text-white transition-colors cursor-default"
              aria-label="بحر البحر الأحمر"
            >
              <Waves className="w-3.5 h-3.5" />
              <span className="text-[11px]">نسيم البحر الأحمر</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
