import React, { useState } from 'react';
import {
  ExternalLink,
  Share2,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  Send,
  Video,
  Camera,
  Sparkles,
  QrCode,
  ShieldCheck,
  Radio,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { BRAND_INFO } from '../data/initialData';

export interface SocialAccount {
  id: string;
  name: string;
  platform: 'whatsapp' | 'twitter' | 'snapchat' | 'instagram' | 'tiktok';
  handle: string;
  link: string;
  role: string;
  description: string;
  highlightBadge: string;
  followers?: string;
  iconBg: string;
  borderColor: string;
  actionText: string;
  featured?: boolean;
}

// Exact official channels extracted directly from Linkfly (https://linkfly.to/60512dkhz5h)
export const OFFICIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'whatsapp_ads',
    name: 'واتساب التغطيات والإعلانات الرسمية',
    platform: 'whatsapp',
    handle: 'حساب الأعمال المعتمد',
    link: 'https://wa.me/message/U5DVNDGPZSO3L1',
    role: 'للإعلانات والتغطيات الميدانية والترويج التجاري',
    description: 'القناة الرسمية المباشرة للتنسيق مع فريق أبحر الشمالية لحجز التغطيات الإعلانية لمختلف الأنشطة التجارية والمطاعم والفعاليات.',
    highlightBadge: 'مباشر للأنشطة التجارية',
    followers: 'استجابة سريعة',
    iconBg: 'bg-[#25D366]',
    borderColor: 'hover:border-[#25D366]',
    actionText: 'مراسلة واتساب للإعلانات',
    featured: true,
  },
  {
    id: 'twitter_x',
    name: 'اسأل أبحر على منصة إكس (Twitter)',
    platform: 'twitter',
    handle: '@northabhor',
    link: 'https://x.com/northabhor',
    role: 'الحساب الإخباري والمجتمعي الأول',
    description: 'نقل أخبار الحي اللحظية، استفسارات وتطلعات الأهالي، متابعة مشاريع البنية التحتية، وتغطية الفعاليات بأبحر الشمالية.',
    highlightBadge: 'الأكثر تفاعلاً وتغطية',
    followers: '+85 ألف متابع',
    iconBg: 'bg-black',
    borderColor: 'hover:border-black',
    actionText: 'متابعة على منصة X',
    featured: true,
  },
  {
    id: 'snapchat_live',
    name: 'لايف أبحر | جدة (Snapchat)',
    platform: 'snapchat',
    handle: 'لايف أبحر الرسمي',
    link: 'https://snapchat.com/t/zxpRiU2g',
    role: 'تغطيات ميدانية حية ويومية',
    description: 'بث حي ومباشر لأجواء شواطئ وكورنيش أبحر، الفعاليات البحرية، المطاعم الجديدة، والحياة اليومية لحي أبحر الشمالية.',
    highlightBadge: 'بث حي ويومي',
    followers: '+120 ألف مشترك',
    iconBg: 'bg-[#FFFC00]',
    borderColor: 'hover:border-[#FFFC00]',
    actionText: 'إضافة على سناب شات',
    featured: true,
  },
  {
    id: 'instagram',
    name: 'اسأل أبحر على إنستغرام (Instagram)',
    platform: 'instagram',
    handle: '@northabhor',
    link: 'https://www.instagram.com/northabhor?igsh=dHM3MG5mMDJyamo4',
    role: 'معرض بصري ومقاطع ريلز احترافية',
    description: 'لقطات فوتوغرافية ومقاطع ريلز لأجمل معالم أبحر، الشواطئ والمراسي البحرية، ودليل المقاهي والمطاعم المميزة.',
    highlightBadge: 'ريلز وتصوير احترافي',
    followers: '+45 ألف متابع',
    iconBg: 'bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4]',
    borderColor: 'hover:border-[#E1306C]',
    actionText: 'متابعة على إنستغرام',
    featured: false,
  },
  {
    id: 'tiktok',
    name: 'اسأل أبحر على تيك توك (TikTok)',
    platform: 'tiktok',
    handle: '@ask_abhur',
    link: 'https://www.tiktok.com/@ask_abhur?_t=8nPwLoHGDDU&_r=1',
    role: 'فيديوهات قصيرة وجولات سريعة',
    description: 'فيديوهات تفاعلية سريعة، تجارب حية في وجهات أبحر، ومقاطع تريند تسلط الضوء على نبض الحياة في الحي.',
    highlightBadge: 'فيديوهات وتريندات الحي',
    followers: '+60 ألف متابع',
    iconBg: 'bg-[#000000]',
    borderColor: 'hover:border-[#00f2fe]',
    actionText: 'متابعة على تيك توك',
    featured: false,
  },
];

interface SocialHubProps {
  onOpenTweetImporter?: () => void;
  onNavigateHome?: () => void;
}

export const SocialHub: React.FC<SocialHubProps> = ({
  onOpenTweetImporter,
  onNavigateHome,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeQrModal, setActiveQrModal] = useState<SocialAccount | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const linkflyUrl = 'https://linkfly.to/60512dkhz5h';

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    const whatsappUrl = `https://wa.me/message/U5DVNDGPZSO3L1?text=${encodeURIComponent(
      `السلام عليكم، أود الاستفسار والتنسيق مع إدارة أبحر الشمالية:\n${contactMessage}`
    )}`;
    window.open(whatsappUrl, '_blank');
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactMessage('');
    }, 3000);
  };

  return (
    <div className="py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Hero Banner - Marine Coastal Theme */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0C3552] via-[#051C2C] to-[#028090] text-white p-6 sm:p-10 border border-[#C29B63]/30 shadow-lg">
        {/* Subtle Red Sea Reef / Wave Graphic Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C29B63_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
        <div className="absolute -end-16 -top-16 w-80 h-80 rounded-full bg-[#028090]/20 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8">
          {/* Avatar / Brand Profile Picture from Linkfly */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-b from-[#C29B63] to-[#028090] shadow-xl">
                <img
                  src="https://fly.linkcdn.cc/upload/2024052922/171702263500060670.jpg"
                  alt="اسأل ابحر"
                  className="w-full h-full object-cover rounded-[14px]"
                  onError={(e) => {
                    // Fallback to local high-res coastal avatar if linkcdn is blocked
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80';
                  }}
                />
              </div>
              <div className="absolute -bottom-2 -end-2 bg-[#C29B63] text-white p-1.5 rounded-full shadow-md border-2 border-[#0C3552]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
                  شبكة قنوات وحسابات أبحر الرسمية
                </h1>
                <span className="bg-[#C29B63] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>موثق Linkfly</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#F2ECE1]/90 leading-relaxed">
                حسابات تهتم بنقل أخبار الحي واستقبال أسئلتكم واستفساراتكم، ونشر ملاحظاتكم وتطلعاتكم، ودعم منتجاتكم ومتاجركم، وعمل التغطيات الإعلانية الاحترافية لمختلف الأنشطة التجارية بأبحر الشمالية وجدة.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-[#C29B63]">
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-[#25D366] animate-pulse" />
                  <span>تغطيات ميدانية لحظية</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>الحساب المعتمد لسكان وزوار أبحر</span>
                </span>
              </div>
            </div>
          </div>

          {/* Direct Linkfly & Share Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full sm:w-auto shrink-0">
            <a
              href={linkflyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#C29B63] hover:bg-[#AC8449] text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02]"
            >
              <span>فتح رابط Linkfly الأصلي</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleCopyLink(linkflyUrl)}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs backdrop-blur-xs transition-colors border border-white/15"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>تم نسخ الرابط!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ رابط الصفحة</span>
                </>
              )}
            </button>

            {onOpenTweetImporter && (
              <button
                onClick={onOpenTweetImporter}
                className="inline-flex items-center justify-center gap-2 bg-[#028090]/50 hover:bg-[#028090] text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors border border-[#028090]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C29B63]" />
                <span>استيراد تغريدات من @northabhor</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Social Channels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#0C3552]/10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0C3552] font-serif flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#C29B63]" />
              <span>القنوات والحسابات المعتمدة (الرابط الموحد Linkfly)</span>
            </h2>
            <p className="text-xs text-[#0C3552]/70">
              تابع الحسابات الرسمية على جميع المنصات لمتابعة المستجدات والتواصل المباشر مع إدارة المجتمع.
            </p>
          </div>
          <span className="hidden sm:inline-block bg-[#0C3552]/5 text-[#0C3552] text-xs font-bold px-3 py-1 rounded-lg">
            5 قنوات معتمدة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {OFFICIAL_ACCOUNTS.map((acc) => (
            <div
              key={acc.id}
              className={`bg-[#FAF8F5] rounded-2xl p-5 border border-[#0C3552]/15 shadow-xs transition-all hover:shadow-md flex flex-col justify-between group ${acc.borderColor}`}
            >
              <div className="space-y-3.5">
                {/* Channel Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl ${acc.iconBg} flex items-center justify-center text-white shadow-sm shrink-0`}
                    >
                      {acc.platform === 'whatsapp' && <MessageCircle className="w-6 h-6 fill-current" />}
                      {acc.platform === 'twitter' && (
                        <span className="font-bold text-lg font-sans">𝕏</span>
                      )}
                      {acc.platform === 'snapchat' && (
                        <Camera className="w-6 h-6 text-black fill-black" />
                      )}
                      {acc.platform === 'instagram' && <Camera className="w-6 h-6" />}
                      {acc.platform === 'tiktok' && <Video className="w-6 h-6" />}
                    </div>

                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#0C3552] group-hover:text-[#028090] transition-colors leading-snug">
                        {acc.name}
                      </h3>
                      <div className="text-xs text-[#C29B63] font-semibold flex items-center gap-1">
                        <span>{acc.handle}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#028090]" />
                      </div>
                    </div>
                  </div>

                  <span className="bg-[#C29B63]/10 text-[#AC8449] border border-[#C29B63]/25 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {acc.highlightBadge}
                  </span>
                </div>

                {/* Role and description */}
                <p className="text-xs text-[#0C3552]/80 leading-relaxed font-sans">
                  {acc.description}
                </p>

                {acc.followers && (
                  <div className="flex items-center gap-2 text-[11px] text-[#0C3552]/60 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#028090]"></span>
                    <span>{acc.followers}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-[#0C3552]/10 flex items-center gap-2">
                <a
                  href={acc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#0C3552] hover:bg-[#051C2C] text-white text-xs font-bold py-2.5 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{acc.actionText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveQrModal(acc)}
                  title="عرض باركود القناة للماسح الضوئي"
                  className="p-2.5 rounded-xl border border-[#0C3552]/20 hover:bg-[#F2ECE1] text-[#0C3552] transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Direct WhatsApp Contact & Coverage Request Form */}
      <div className="bg-[#F2ECE1] rounded-3xl p-6 sm:p-8 border border-[#0C3552]/15 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-1 space-y-2">
            <span className="inline-flex items-center gap-1 bg-[#25D366]/20 text-[#128C7E] px-2.5 py-0.5 rounded-md text-[11px] font-bold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>خدمة العملاء والتغطيات</span>
            </span>
            <h3 className="text-xl font-bold text-[#0C3552] font-serif">
              طلب تغطية إعلانية أو إرسال استفسار
            </h3>
            <p className="text-xs text-[#0C3552]/75 leading-relaxed">
              لديك مطعم، كافيه، متجر، أو مدرسة في أبحر الشمالية وترغب في تغطية خاصة عبر شبكة حساباتنا؟ اكتب رسالتك وسيتم تحويلك مباشرة للواتساب المعتمد.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="lg:col-span-2 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="اكتب استفسارك أو تفاصيل نشاطك التجاري لطلب التغطية..."
              className="flex-1 bg-white border border-[#0C3552]/20 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0C3552] placeholder:text-[#0C3552]/40 focus:outline-none focus:ring-2 focus:ring-[#C29B63]"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>إرسال عبر واتساب</span>
            </button>
          </form>
        </div>
      </div>

      {/* QR Code Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 border border-[#0C3552]/20 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C3552]/10">
              <h4 className="font-bold text-sm text-[#0C3552] font-serif">{activeQrModal.name}</h4>
              <button
                onClick={() => setActiveQrModal(null)}
                className="text-xs text-[#0C3552]/60 hover:text-[#0C3552] font-bold p-1"
              >
                إغلاق ✕
              </button>
            </div>

            {/* QR Code Graphic Representation */}
            <div className="bg-white p-4 rounded-2xl border border-[#0C3552]/10 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  activeQrModal.link
                )}`}
                alt={activeQrModal.name}
                className="w-44 h-44 mx-auto rounded-lg"
              />
            </div>

            <p className="text-xs text-[#0C3552]/70">
              امسح الباركود بكاميرا هاتفك للوصول السريع إلى الحساب مباشرة
            </p>

            <div className="flex items-center justify-center gap-2">
              <a
                href={activeQrModal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0C3552] text-white text-xs font-bold py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5"
              >
                <span>فتح الحساب</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
