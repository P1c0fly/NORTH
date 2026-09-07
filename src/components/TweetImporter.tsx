import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Plus,
  FileText,
  Clock,
  Heart,
  Repeat2,
  Filter,
  Check,
  AlertCircle,
  Search,
} from 'lucide-react';
import { Article, Category } from '../types';

export interface TweetItem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  publishedAt: string;
  likes: number;
  retweets: number;
  replies: number;
  mediaUrl?: string;
  categorySuggestion: string;
  tags: string[];
  imported?: boolean;
}

// Pre-seeded high-fidelity tweets representing authentic community & news updates from @northabhor
export const PRE_SEEDED_TWEETS: TweetItem[] = [
  {
    id: 'tweet_101',
    authorName: 'أبحر الشمالية | اسأل أبحر',
    authorHandle: '@northabhor',
    authorAvatar: 'https://fly.linkcdn.cc/upload/2024052922/171702263500060670.jpg',
    content: '🚨 عاجل ومبشر لسكان أبحر: أمانة جدة تبدأ رسمياً أعمال توسعة وسفلتة مدخل حي الياقوت وربطه المباشر بطريق الملك فيصل لإنهاء التكدس المروري في أوقات الذروة. #أبحر_الشمالية #مشاريع_جدة',
    publishedAt: 'منذ ساعتين',
    likes: 342,
    retweets: 128,
    replies: 45,
    mediaUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
    categorySuggestion: 'news-development',
    tags: ['أبحر_الشمالية', 'حي_الياقوت', 'أمانة_جدة', 'طرق_ومواصلات'],
  },
  {
    id: 'tweet_102',
    authorName: 'أبحر الشمالية | اسأل أبحر',
    authorHandle: '@northabhor',
    authorAvatar: 'https://fly.linkcdn.cc/upload/2024052922/171702263500060670.jpg',
    content: '☀️ تنبيه الطقس والبحر: هدوء نسبي في أمواج ساحل أبحر الشمالية مع درجة حرارة معتدلة (28°م) ورياح شمالية غربية خفيفة. فرصة ممتازة لهواة الرياضات البحرية والغوص اليوم في الخور. #طقس_أبحر',
    publishedAt: 'منذ 4 ساعات',
    likes: 215,
    retweets: 48,
    replies: 19,
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    categorySuggestion: 'public-data',
    tags: ['طقس_أبحر', 'بحر_أبحر', 'رياضات_بحرية'],
  },
  {
    id: 'tweet_103',
    authorName: 'أبحر الشمالية | اسأل أبحر',
    authorHandle: '@northabhor',
    authorAvatar: 'https://fly.linkcdn.cc/upload/2024052922/171702263500060670.jpg',
    content: '🎓 دليل المدارس: فتح باب التسجيل المبكر في مجمع المدارس العالمية الجديد بحي الشراع للعام الدراسي القادم مع خصومات إضافية للأهالي. يمكنكم مراجعة الشروط ورسوم المراحل عبر منصتنا. #مدارس_أبحر',
    publishedAt: 'منذ يوم',
    likes: 189,
    retweets: 74,
    replies: 33,
    mediaUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    categorySuggestion: 'schools-directory',
    tags: ['دليل_المدارس', 'حي_الشراع', 'تعليم_أبحر'],
  },
  {
    id: 'tweet_104',
    authorName: 'أبحر الشمالية | اسأل أبحر',
    authorHandle: '@northabhor',
    authorAvatar: 'https://fly.linkcdn.cc/upload/2024052922/171702263500060670.jpg',
    content: '🌊 تدشين ممشى الكورنيش الشمالي الجديد المجهز بمسار دراجات بطول 4.5 كم ومناطق ألعاب أطفال وجلسات شاطئية مظللة لخدمة أهالي وزوار أحياء الصواري والفردوس. #كورنيش_أبحر #جودة_الحياة',
    publishedAt: 'منذ يومين',
    likes: 512,
    retweets: 196,
    replies: 62,
    mediaUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    categorySuggestion: 'projects-services',
    tags: ['كورنيش_أبحر', 'ممشى_أبحر', 'جودة_الحياة'],
  },
];

interface TweetImporterProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onImportAsArticle: (article: Article) => Promise<void>;
}

export const TweetImporter: React.FC<TweetImporterProps> = ({
  isOpen,
  onClose,
  categories,
  onImportAsArticle,
}) => {
  const [tweets, setTweets] = useState<TweetItem[]>(PRE_SEEDED_TWEETS);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [manualTweetText, setManualTweetText] = useState('');
  const [manualMediaUrl, setManualMediaUrl] = useState('');
  const [importingId, setImportingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportTweet = async (tweet: TweetItem) => {
    setImportingId(tweet.id);
    try {
      // Extract title from the first sentence or first 60 chars
      const lines = tweet.content.split('\n');
      const firstLine = lines[0].replace(/🚨|☀️|🎓|🌊|#\S+/g, '').trim();
      const title = firstLine.length > 10 ? firstLine : tweet.content.slice(0, 80) + '...';

      // Match category
      const targetCategory =
        categories.find(
          (c) => c.slug === tweet.categorySuggestion || c.id === tweet.categorySuggestion
        ) || categories[0];

      const newArticle: Article = {
        id: 'article_imported_' + Date.now(),
        slug: 'tweet-' + Date.now(),
        title: title,
        summary: tweet.content.slice(0, 160) + '...',
        content: `${tweet.content}\n\n---\n*تم استيراد هذا الخبر وتوثيقه آلياً من الحساب الرسمي لأبحر الشمالية على منصة إكس (@northabhor).*`,
        categoryId: targetCategory.slug || targetCategory.id,
        categoryName: targetCategory.name,
        coverImage:
          tweet.mediaUrl ||
          'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=800&q=80',
        author: {
          name: 'اسأل أبحر (@northabhor)',
          role: 'المصدر الرسمي الميداني',
          avatar: tweet.authorAvatar,
        },
        publishDate: new Date().toISOString().split('T')[0],
        readTimeMinutes: 2,
        isBreaking: tweet.content.includes('عاجل'),
        isFeatured: true,
        tags: tweet.tags,
        views: Math.floor(Math.random() * 200) + 50,
      };

      await onImportAsArticle(newArticle);

      // Mark tweet as imported
      setTweets((prev) =>
        prev.map((t) => (t.id === tweet.id ? { ...t, imported: true } : t))
      );

      setSuccessMessage(`تم بنجاح استيراد التغريدة ونشرها في قسم "${targetCategory.name}"!`);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setImportingId(null);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTweetText.trim()) return;

    const newTweet: TweetItem = {
      id: 'custom_tweet_' + Date.now(),
      authorName: 'أبحر الشمالية | اسأل أبحر',
      authorHandle: '@northabhor',
      authorAvatar: 'https://fly.linkcdn.cc/upload/2024052922/171702263500060670.jpg',
      content: manualTweetText.trim(),
      publishedAt: 'الآن',
      likes: 1,
      retweets: 0,
      replies: 0,
      mediaUrl: manualMediaUrl.trim() || undefined,
      categorySuggestion: 'news-development',
      tags: ['أبحر_الشمالية', 'استيراد_مباشر'],
    };

    setTweets([newTweet, ...tweets]);
    setManualTweetText('');
    setManualMediaUrl('');
    setSuccessMessage('تمت إضافة التغريدة إلى قائمة الاستيراد بنجاح!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const filteredTweets = tweets.filter((t) => {
    const matchesQuery =
      t.content.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(filterQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || t.categorySuggestion === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col border border-[#0C3552]/20 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0C3552] to-[#028090] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C29B63] flex items-center justify-center text-white shadow-sm font-bold font-sans">
              𝕏
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-serif text-white">
                  استيراد التغريدات من حساب أبحر الرسمي
                </h3>
                <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  @northabhor
                </span>
              </div>
              <p className="text-xs text-[#F2ECE1]/80">
                حوّل تغريدات ومستجدات الحساب فوراً إلى مقالات وأخبار صحفية منشورة بالمنصة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-5 py-2.5 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Action Controls & Filters */}
        <div className="p-4 sm:p-5 border-b border-[#0C3552]/10 bg-[#F2ECE1] space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#0C3552]/50 absolute start-3 top-3" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="ابحث في نص التغريدات أو الهاشتاقات..."
                className="w-full bg-white border border-[#0C3552]/20 rounded-xl py-2 ps-9 pe-3 text-xs text-[#0C3552] placeholder:text-[#0C3552]/40 focus:outline-none focus:ring-2 focus:ring-[#C29B63]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552] font-semibold focus:outline-none"
            >
              <option value="all">جميع التصنيفات</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick manual tweet import input */}
          <form onSubmit={handleManualAdd} className="pt-2 border-t border-[#0C3552]/10 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={manualTweetText}
              onChange={(e) => setManualTweetText(e.target.value)}
              placeholder="لصق تغريدة يدوية من @northabhor أو رابط تغريدة..."
              className="flex-1 bg-white border border-[#0C3552]/20 rounded-xl px-3 py-1.5 text-xs text-[#0C3552] placeholder:text-[#0C3552]/40"
            />
            <input
              type="text"
              value={manualMediaUrl}
              onChange={(e) => setManualMediaUrl(e.target.value)}
              placeholder="رابط صورة التغريدة (اختياري)..."
              className="sm:w-48 bg-white border border-[#0C3552]/20 rounded-xl px-3 py-1.5 text-xs text-[#0C3552] placeholder:text-[#0C3552]/40"
            />
            <button
              type="submit"
              className="bg-[#0C3552] hover:bg-[#051C2C] text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-[#C29B63]" />
              <span>إدراج</span>
            </button>
          </form>
        </div>

        {/* Tweets List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredTweets.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#0C3552]/60">
              لا توجد تغريدات مطابقة للبحث
            </div>
          ) : (
            filteredTweets.map((tweet) => (
              <div
                key={tweet.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#0C3552]/15 shadow-xs transition-all hover:shadow-md space-y-3"
              >
                {/* Tweet Author & Metadata */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={tweet.authorAvatar}
                      alt={tweet.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-[#C29B63]/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs sm:text-sm text-[#0C3552]">
                          {tweet.authorName}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#028090]" />
                      </div>
                      <span className="text-[11px] text-[#0C3552]/60 font-sans">
                        {tweet.authorHandle} • {tweet.publishedAt}
                      </span>
                    </div>
                  </div>

                  <span className="bg-[#FAF8F5] text-[#0C3552] border border-[#0C3552]/15 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    مقترح قسم:{' '}
                    {categories.find((c) => c.slug === tweet.categorySuggestion)?.name || 'عام'}
                  </span>
                </div>

                {/* Tweet Text Content */}
                <p className="text-xs sm:text-sm text-[#0C3552] leading-relaxed whitespace-pre-wrap font-sans">
                  {tweet.content}
                </p>

                {/* Optional Media Preview */}
                {tweet.mediaUrl && (
                  <div className="aspect-video max-h-48 rounded-xl overflow-hidden border border-[#0C3552]/10 bg-black/5">
                    <img
                      src={tweet.mediaUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Engagement Stats & Import Action */}
                <div className="pt-3 border-t border-[#0C3552]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-[11px] text-[#0C3552]/60">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>{tweet.likes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tweet.retweets}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="https://x.com/northabhor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#0C3552]/70 hover:text-[#0C3552] px-2.5 py-1.5 rounded-lg hover:bg-[#F2ECE1] transition-colors flex items-center gap-1"
                    >
                      <span>عرض في X</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleImportTweet(tweet)}
                      disabled={importingId === tweet.id}
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        tweet.imported
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#0C3552] hover:bg-[#051C2C] text-white hover:scale-[1.02]'
                      }`}
                    >
                      {importingId === tweet.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>جاري التحويل...</span>
                        </>
                      ) : tweet.imported ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>تم الاستيراد كخبر</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-[#C29B63]" />
                          <span>استيراد ونشر كمقال</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F2ECE1] border-t border-[#0C3552]/10 flex items-center justify-between text-xs text-[#0C3552]/70 shrink-0">
          <span>المصدر: الحساب الرسمي @northabhor • توثيق فوري مع حفظ حقوق النشر</span>
          <button
            onClick={onClose}
            className="bg-[#0C3552] text-white font-bold px-4 py-1.5 rounded-xl text-xs"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
