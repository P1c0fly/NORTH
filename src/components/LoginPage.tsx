import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Database,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { signInWithEmailPassword, signInWithMagicLink, isSupabaseConfigured } from '../lib/supabase/client';

interface LoginPageProps {
  onSuccess: (user: any) => void;
  onBackToHome: () => void;
  redirectPath?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onBackToHome,
  redirectPath = '/admin',
}) => {
  const [authMode, setAuthMode] = useState<'password' | 'magic-link'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = await signInWithEmailPassword(email, password);
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg('تم التحقق بنجاح! جاري الانتقال إلى لوحة الإدارة...');
      setTimeout(() => {
        onSuccess(result.user);
      }, 700);
    } else {
      setErrorMsg(result.error || 'فشل تسجيل الدخول، يرجى المحاولة مرة أخرى');
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = await signInWithMagicLink(email);
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg(
        result.isDemo
          ? 'تم التحقق في الوضع التجريبي! جاري الدخول للوحة التحكم...'
          : `تم إرسال الرابط السحري إلى ${email}. يرجى فحص صندوق الوارد لتسجيل الدخول الفوري.`
      );
      if (result.isDemo) {
        setTimeout(() => {
          onSuccess({ email, role: 'authenticated' });
        }, 1000);
      }
    } else {
      setErrorMsg(result.error || 'فشل إرسال الرابط السحري');
    }
  };

  const fillQuickCredentials = () => {
    setEmail('admin@northabhor.local');
    setPassword('NorthAbhor2026!');
    setErrorMsg(null);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FAF9F6] text-[#0A3641] flex flex-col justify-between selection:bg-[#E06D53]/20 selection:text-[#0A3641]"
    >
      {/* Editorial Top Accent Bar */}
      <div className="h-2 bg-gradient-to-r from-[#0A3641] via-[#00A896] to-[#E06D53]" />

      {/* Header Bar */}
      <header className="px-6 py-4 border-b border-[#0A3641]/10 flex items-center justify-between max-w-6xl mx-auto w-full">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-bold text-[#0A3641]/70 hover:text-[#0A3641] transition-colors py-1.5 px-3 rounded-xl hover:bg-[#FAF8F5]"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية - بوابة أبحر الشمالية</span>
        </button>

        <div className="flex items-center gap-3">
          <a
            href="https://x.com/Northabhor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-[#0A3641] hover:text-[#E06D53] transition-colors bg-white px-3 py-1.5 rounded-full border border-[#0A3641]/15 shadow-2xs"
          >
            <span className="text-[#E06D53]">𝕏</span>
            <span>@Northabhor</span>
          </a>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-[#0A3641]/15 shadow-xl p-7 sm:p-9 space-y-6">
          
          {/* Brand & Editorial Identity */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A3641] text-white shadow-md mb-1">
              <Compass className="w-7 h-7 text-[#00A896]" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-widest text-[#00A896] font-bold uppercase">
                بوابة المشرفين المعتمدين • Supabase Auth
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A3641]">
                تسجيل الدخول للوحة التحكم
              </h1>
              <p className="text-xs sm:text-sm text-[#0A3641]/70">
                منصة أبحر الشمالية (@Northabhor) - إدارة المقالات، دليل المدارس، وجداول البيانات
              </p>
            </div>
          </div>

          {/* Supabase Connection Pill */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#0A3641]/10 text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#00A896]" />
              <span className="font-semibold text-[#0A3641]">محرك المصادقة:</span>
              <span className="font-bold text-[#00A896]">
                {isConfigured ? 'Supabase Auth (Cloud RLS)' : 'وضع المعاينة المحلي (Local Session)'}
              </span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Guard Redirect Notice if any */}
          {redirectPath && redirectPath.includes('admin') && (
            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">منطقة محمية بجدار الحماية (Middleware Guard)</strong>
                <span>يجب تسجيل الدخول بحساب المشرف للوصول إلى الرابط المطلوب: </span>
                <code className="font-mono text-[11px] bg-amber-100/70 px-1.5 py-0.5 rounded text-amber-950 font-bold">
                  {redirectPath}
                </code>
              </div>
            </div>
          )}

          {/* Auth Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#FAF9F6] rounded-2xl border border-[#0A3641]/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'password'
                  ? 'bg-white text-[#0A3641] shadow-xs'
                  : 'text-[#0A3641]/60 hover:text-[#0A3641]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#E06D53]" />
              <span>كلمة المرور المشفرة</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('magic-link');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'magic-link'
                  ? 'bg-white text-[#0A3641] shadow-xs'
                  : 'text-[#0A3641]/60 hover:text-[#0A3641]'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-[#00A896]" />
              <span>الرابط السحري (Magic Link)</span>
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form 1: Password Login */}
          {authMode === 'password' ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0A3641]">البريد الإلكتروني للإدارة *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#0A3641]/40 absolute start-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@northabhor.local"
                    required
                    className="w-full bg-[#FAF9F6] border border-[#0A3641]/20 rounded-xl py-2.5 ps-10 pe-3 text-xs sm:text-sm text-[#0A3641] focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#0A3641]">كلمة المرور *</label>
                  <button
                    type="button"
                    onClick={fillQuickCredentials}
                    className="text-[11px] text-[#00A896] hover:underline font-bold"
                  >
                    تعبئة بيانات التجربة الافتراضية
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#0A3641]/40 absolute start-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#FAF9F6] border border-[#0A3641]/20 rounded-xl py-2.5 ps-10 pe-3 text-xs sm:text-sm text-[#0A3641] focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0A3641] hover:bg-[#051C2C] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري التحقق عبر Supabase Auth...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#00A896]" />
                    <span>تسجيل الدخول الآمن</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Form 2: Magic Link Login */
            <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0A3641]">البريد الإلكتروني للتحقق *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#0A3641]/40 absolute start-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@northabhor.local"
                    required
                    className="w-full bg-[#FAF9F6] border border-[#0A3641]/20 rounded-xl py-2.5 ps-10 pe-3 text-xs sm:text-sm text-[#0A3641] focus:outline-none focus:ring-2 focus:ring-[#00A896]"
                  />
                </div>
                <p className="text-[11px] text-[#0A3641]/60">
                  سنرسل رابط مصادقة آمن لمرة واحدة (One-Time Magic Link) إلى بريدك الإلكتروني لتسجيل الدخول دون الحاجة لكلمة مرور.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00A896] hover:bg-[#028090] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري إرسال الرابط السحري...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>إرسال الرابط السحري إلى البريد</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Info Box */}
          <div className="pt-3 border-t border-[#0A3641]/10 text-xs text-[#0A3641]/70 flex items-center justify-between">
            <span className="font-semibold">المشرف المعتمد: admin@northabhor.local</span>
            <button
              type="button"
              onClick={fillQuickCredentials}
              className="text-[#E06D53] hover:underline font-bold"
            >
              تجربة سريعة
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-[#0A3641]/60 border-t border-[#0A3641]/10">
        © 2026 بوابة أبحر الشمالية @Northabhor • نظام الحماية وقواعد RLS مدعوم بواسطة Supabase & PostgreSQL
      </footer>
    </div>
  );
};
