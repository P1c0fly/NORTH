import React, { useState, useEffect } from 'react';
import { Flame, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Article } from '../types';
import { BRAND_INFO } from '../data/initialData';

interface BreakingTickerProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ articles, onSelectArticle }) => {
  const breakingArticles = articles.filter((a) => a.isBreaking || a.isFeatured);
  const items = breakingArticles.length > 0 ? breakingArticles : articles.slice(0, 3);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="bg-[#FAF9F6] border-b border-[#0A3641]/10 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          {/* Coral Badge */}
          <div className="flex items-center gap-1.5 bg-[#E06D53] text-white px-2.5 py-1 rounded-md font-black shrink-0 shadow-xs">
            <Flame className="w-3.5 h-3.5 animate-bounce" />
            <span className="tracking-tight">رصد عاجل</span>
          </div>

          {/* Headline Text with animation */}
          <div
            onClick={() => onSelectArticle(currentItem)}
            className="cursor-pointer font-bold text-[#0A3641] hover:text-[#E06D53] transition-colors truncate flex items-center gap-2"
          >
            <span className="bg-[#00A896]/15 text-[#0A3641] font-semibold text-[11px] px-2 py-0.5 rounded-full hidden md:inline shrink-0">
              {currentItem.categoryName}
            </span>
            <span className="truncate">{currentItem.title}</span>
          </div>
        </div>

        {/* Controls and Twitter Link */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#0A3641]/50 hidden lg:inline">
            {currentIndex + 1} من {items.length}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))}
              className="p-1 rounded hover:bg-[#F4F1EA] text-[#0A3641]/70 transition-colors"
              aria-label="السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
              className="p-1 rounded hover:bg-[#F4F1EA] text-[#0A3641]/70 transition-colors"
              aria-label="التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <a
            href={BRAND_INFO.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-[#E06D53] hover:underline font-bold ps-2 border-s border-[#0A3641]/10"
          >
            <span>تابع التغطية على X</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
