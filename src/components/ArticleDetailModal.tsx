import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Eye,
  Calendar,
  User,
  Share2,
  Bookmark,
  Check,
  Printer,
  ListTree,
  ExternalLink,
  Table as TableIcon,
} from 'lucide-react';
import { Article, DataTableData } from '../types';
import { DataTableEmbed } from './DataTableEmbed';
import { BRAND_INFO } from '../data/initialData';
import { api } from '../services/api';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
  onSelectTag?: (tag: string) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onSelectTag,
}) => {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [dbTables, setDbTables] = useState<DataTableData[]>([]);

  // Fetch Supabase excel_tables linked to this article
  useEffect(() => {
    if (!article?.id) return;
    let isMounted = true;
    api.getExcelTables(article.id).then((tables) => {
      if (isMounted && tables && tables.length > 0) {
        setDbTables(
          tables.map((t) => ({
            id: t.id,
            title: t.title || 'جدول بيانات إحصائي',
            headers: t.headers,
            rows: t.rows,
            source: t.source || 'أبحر الشمالية @Northabhor',
          }))
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, [article?.id]);

  if (!article) return null;

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${article.title}\nعبر المنصة الإخبارية لأبحر الشمالية @Northabhor:\n`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const copyArticleLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#06232B]/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-[#0A3641]/15 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-[#0A3641] text-white px-5 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            <span className="bg-[#E06D53] text-white px-2 py-0.5 rounded text-[11px] font-black">
              {BRAND_INFO.handle}
            </span>
            <span>{article.categoryName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={shareOnTwitter}
              className="inline-flex items-center gap-1.5 bg-[#06232B] hover:bg-[#E06D53] text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
              title="مشاركة على X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>مشاركة</span>
            </button>

            <button
              onClick={copyArticleLink}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="نسخ الرابط"
            >
              {copied ? <Check className="w-4 h-4 text-[#00A896]" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="حفظ المقال"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#E06D53] text-[#E06D53]' : ''}`} />
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:inline-block"
              title="طباعة"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/15 hover:bg-[#E06D53] text-white transition-colors ms-2"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className="overflow-y-auto p-5 sm:p-8 flex-1">
          {/* Article Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#0A3641]/70 font-semibold mb-3">
              <span className="bg-[#00A896]/15 text-[#0A3641] px-2.5 py-1 rounded-full">
                {article.categoryName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#0A3641]/60" />
                <span>{article.publishDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#00A896]" />
                <span>وقت القراءة المقدر: {article.readTimeMinutes} دقائق</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-[#E06D53]" />
                <span>{article.views} مشاهدة</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0A3641] font-serif leading-tight mb-4">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-[#0A3641]/80 leading-relaxed font-normal bg-[#F4F1EA] p-4 rounded-2xl border-s-4 border-[#00A896]">
              {article.summary}
            </p>
          </div>

          {/* Cover Media */}
          <div className="rounded-2xl overflow-hidden mb-8 border border-[#0A3641]/10 bg-[#0A3641] aspect-[16/9]">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Table of Contents (فهرس المحتويات) */}
          {article.tableOfContents && article.tableOfContents.length > 0 && (
            <div className="bg-[#F4F1EA] rounded-2xl p-4 sm:p-5 mb-8 border border-[#0A3641]/15">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0A3641] mb-3">
                <ListTree className="w-4 h-4 text-[#00A896]" />
                <span>فهرس المحتويات (Table of Contents)</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#0A3641]/80 font-medium">
                {article.tableOfContents.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 hover:text-[#E06D53] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A896]"></span>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Article Content (Rendered with clean typography) */}
          <div className="prose max-w-none text-[#0A3641] text-base leading-relaxed space-y-4">
            {article.content.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={pIdx}
                    className="text-lg sm:text-xl font-bold font-serif text-[#0A3641] pt-4 pb-1 border-b border-[#0A3641]/10"
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
                const listItems = paragraph.split('\n');
                return (
                  <ul key={pIdx} className="space-y-2 my-3 ps-4 list-disc marker:text-[#E06D53]">
                    {listItems.map((li, lIdx) => (
                      <li key={lIdx} className="font-normal text-sm sm:text-base leading-relaxed">
                        {li.replace(/^[-\d.]\s*/, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={pIdx} className="font-normal text-sm sm:text-base leading-loose">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Embedded Dynamic Data Table (if present) */}
          {article.embeddedTable && (
            <div className="mt-8">
              <DataTableEmbed data={article.embeddedTable} />
            </div>
          )}

          {/* Dynamic Supabase Excel Tables (excel_tables) */}
          {dbTables.map((tbl) => (
            <div key={tbl.id} className="mt-8 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A3641] bg-[#00A896]/10 px-3 py-1.5 rounded-xl w-fit">
                <TableIcon className="w-3.5 h-3.5 text-[#00A896]" />
                <span>جدول إحصائي موثق من قاعدة بيانات أبحر (Supabase)</span>
              </div>
              <DataTableEmbed data={tbl} />
            </div>
          ))}

          {/* Author & Editorial Source Badge */}
          <div className="mt-10 pt-6 border-t border-[#0A3641]/15 flex flex-wrap items-center justify-between gap-4 bg-[#F4F1EA] p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0A3641] text-[#E06D53] font-black flex items-center justify-center text-sm shadow-xs">
                {article.author.name.slice(0, 2)}
              </div>
              <div>
                <div className="font-black text-sm text-[#0A3641] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>{article.author.name}</span>
                </div>
                <div className="text-xs text-[#0A3641]/70">{article.author.role}</div>
              </div>
            </div>

            <a
              href={BRAND_INFO.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#0A3641] hover:bg-[#E06D53] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <span>متابعة {BRAND_INFO.handle} على X</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#0A3641]/60 font-semibold">الوسوم:</span>
              {article.tags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onSelectTag) onSelectTag(tag);
                    onClose();
                  }}
                  className="bg-[#F4F1EA] hover:bg-[#0A3641] hover:text-white transition-colors text-[#0A3641] text-xs px-3 py-1 rounded-full font-medium border border-[#0A3641]/10"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
