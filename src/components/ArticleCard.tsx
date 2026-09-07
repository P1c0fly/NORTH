import React from 'react';
import { Clock, Eye, ArrowLeft } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onSelect: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  return (
    <article
      id={`article-card-${article.id}`}
      onClick={() => onSelect(article)}
      className="group cursor-pointer bg-[#F4F1EA] rounded-2xl overflow-hidden border border-[#0A3641]/15 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0A3641]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {article.isBreaking && (
            <span className="absolute top-3 start-3 bg-[#E06D53] text-white text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-xs">
              عاجل
            </span>
          )}
          <span className="absolute bottom-3 start-3 bg-[#0A3641]/85 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
            {article.categoryName}
          </span>
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs text-[#0A3641]/60 mb-2">
            <span>{article.publishDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#00A896]" />
              <span>{article.readTimeMinutes} د قراءة</span>
            </span>
          </div>

          <h3 className="font-bold text-base sm:text-lg text-[#0A3641] group-hover:text-[#E06D53] transition-colors line-clamp-2 leading-snug mb-2 font-serif">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#0A3641]/75 line-clamp-2 leading-relaxed font-normal mb-3">
            {article.summary}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-[#0A3641]/10 flex items-center justify-between text-xs font-bold text-[#00A896] group-hover:text-[#E06D53] transition-colors">
        <span className="flex items-center gap-1">
          <span>قراءة المقال</span>
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        </span>
        <span className="flex items-center gap-1 text-[#0A3641]/50 font-normal">
          <Eye className="w-3.5 h-3.5" />
          <span>{article.views}</span>
        </span>
      </div>
    </article>
  );
};
