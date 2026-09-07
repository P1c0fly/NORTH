import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  ShieldCheck,
  HardDrive,
  FileCode2,
  ExternalLink,
  Layers,
  TableProperties,
  Key,
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase/client';

const FULL_SQL_SCRIPT = `-- ========================================================================
-- North Obhur (@Northabhor) Platform - Supabase PostgreSQL Schema Script
-- Theme: Jeddah Red Sea & North Obhur News, Schools & Data Hub
-- Compatible with Supabase SQL Editor & Migration Engine
-- ========================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------
-- Table: Categories
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ------------------------------------------------------------------------
-- Table: Articles
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    reading_time INTEGER NOT NULL DEFAULT 3,
    cover_image TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    views INTEGER NOT NULL DEFAULT 0,
    is_breaking BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    author_name TEXT DEFAULT 'فريق تحرير @Northabhor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_created ON public.articles(is_published, created_at DESC);

-- ------------------------------------------------------------------------
-- Table: Schools
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schools (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'عالمي',
    rating NUMERIC(3,2) NOT NULL DEFAULT 4.50,
    location_url TEXT,
    stats_json JSONB DEFAULT '{}'::jsonb,
    gender TEXT DEFAULT 'مشترك',
    stages JSONB DEFAULT '["ابتدائي"]'::jsonb,
    neighborhood TEXT DEFAULT 'الياقوت',
    curriculum TEXT,
    fees_range TEXT,
    phone TEXT,
    address TEXT,
    accredited BOOLEAN DEFAULT true,
    reviews_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_schools_rating ON public.schools(rating DESC);
CREATE INDEX IF NOT EXISTS idx_schools_neighborhood ON public.schools(neighborhood);

-- ------------------------------------------------------------------------
-- Table: Excel Tables
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.excel_tables (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    article_id TEXT REFERENCES public.articles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'جدول بيانات تفاعلي',
    headers JSONB NOT NULL DEFAULT '[]'::jsonb,
    rows JSONB NOT NULL DEFAULT '[]'::jsonb,
    source TEXT DEFAULT 'منصة أبحر الشمالية',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_excel_tables_article ON public.excel_tables(article_id);

-- ------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excel_tables ENABLE ROW LEVEL SECURITY;

-- 1. Public Read-Only Policies (SELECT only)
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Articles" ON public.articles FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Public Read Schools" ON public.schools FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Excel Tables" ON public.excel_tables FOR SELECT TO anon, authenticated USING (true);

-- 2. Authenticated Admin Full CRUD Policies
CREATE POLICY "Admin CRUD Categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin CRUD Articles" ON public.articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin CRUD Schools" ON public.schools FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin CRUD Excel Tables" ON public.excel_tables FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------
-- STORAGE BUCKET: northabhor_media
-- ------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('northabhor_media', 'northabhor_media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'northabhor_media');
CREATE POLICY "Admin Upload Media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'northabhor_media');
CREATE POLICY "Admin Delete Media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'northabhor_media');
`;

export const SupabaseSqlSchemaViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const isConnected = isSupabaseConfigured();

  const handleCopySql = () => {
    navigator.clipboard.writeText(FULL_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 text-start">
      {/* Header & Connection status */}
      <div className="bg-[#0A3641] text-white p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#00A896]/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00A896]/20 border border-[#00A896]/40 flex items-center justify-center text-[#00A896]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base font-serif">مخطط قاعدة بيانات PostgreSQL و RLS لـ Supabase</h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isConnected ? 'متصل بـ Supabase Live' : 'وضع المعاينة المحلي (Local Fallback)'}
              </span>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              مخطط رسمي متوافق 100% مع محرر Supabase SQL Editor ومحمي بسياسات الأمان على مستوى الصف RLS
            </p>
          </div>
        </div>

        <button
          onClick={handleCopySql}
          className="inline-flex items-center justify-center gap-2 bg-[#E06D53] hover:bg-[#c95940] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'تم نسخ كود SQL بالكامل!' : 'نسخ كود SQL بنقرة واحدة'}</span>
        </button>
      </div>

      {/* Schema Structure Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Table 1: categories */}
        <div className="bg-white p-4 rounded-2xl border border-[#0A3641]/15 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-[#0A3641] bg-[#FAF9F6] px-2 py-0.5 rounded">
              public.categories
            </span>
            <Layers className="w-4 h-4 text-[#00A896]" />
          </div>
          <p className="text-xs text-[#0A3641]/70 mb-2">أقسام المحتوى وتصنيفات الأخبار والتطوير.</p>
          <div className="text-[11px] font-mono text-[#0A3641]/80 space-y-0.5 bg-[#FAF9F6] p-2 rounded-lg">
            <div>• id (uuid/text pk)</div>
            <div>• name (text)</div>
            <div>• slug (unique)</div>
            <div>• created_at (timestamptz)</div>
          </div>
        </div>

        {/* Table 2: articles */}
        <div className="bg-white p-4 rounded-2xl border border-[#0A3641]/15 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-[#0A3641] bg-[#FAF9F6] px-2 py-0.5 rounded">
              public.articles
            </span>
            <FileCode2 className="w-4 h-4 text-[#E06D53]" />
          </div>
          <p className="text-xs text-[#0A3641]/70 mb-2">الأخبار والمقالات والتحقيقات الصحفية.</p>
          <div className="text-[11px] font-mono text-[#0A3641]/80 space-y-0.5 bg-[#FAF9F6] p-2 rounded-lg">
            <div>• id (uuid/text pk)</div>
            <div>• title, slug, content</div>
            <div>• excerpt, category_id</div>
            <div>• is_published, reading_time</div>
          </div>
        </div>

        {/* Table 3: schools */}
        <div className="bg-white p-4 rounded-2xl border border-[#0A3641]/15 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-[#0A3641] bg-[#FAF9F6] px-2 py-0.5 rounded">
              public.schools
            </span>
            <TableProperties className="w-4 h-4 text-[#00A896]" />
          </div>
          <p className="text-xs text-[#0A3641]/70 mb-2">دليل مدارس ومؤسسات أبحر التعليمية.</p>
          <div className="text-[11px] font-mono text-[#0A3641]/80 space-y-0.5 bg-[#FAF9F6] p-2 rounded-lg">
            <div>• id, name, type</div>
            <div>• rating (numeric 3,2)</div>
            <div>• location_url, stats_json</div>
            <div>• created_at</div>
          </div>
        </div>

        {/* Table 4: excel_tables & Storage */}
        <div className="bg-white p-4 rounded-2xl border border-[#0A3641]/15 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-[#0A3641] bg-[#FAF9F6] px-2 py-0.5 rounded">
              public.excel_tables
            </span>
            <HardDrive className="w-4 h-4 text-[#E06D53]" />
          </div>
          <p className="text-xs text-[#0A3641]/70 mb-2">جداول الإكسل المحللة مع مرفقات الوسائط.</p>
          <div className="text-[11px] font-mono text-[#0A3641]/80 space-y-0.5 bg-[#FAF9F6] p-2 rounded-lg">
            <div>• id, article_id (fk)</div>
            <div>• headers (jsonb)</div>
            <div>• rows (jsonb)</div>
            <div>• bucket: northabhor_media</div>
          </div>
        </div>
      </div>

      {/* RLS Security Matrix */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#0A3641]/15">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-[#00A896]" />
          <h5 className="font-bold text-sm text-[#0A3641]">
            سياسات الأمان وحماية البيانات (Row Level Security - RLS)
          </h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
            <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
              <span>الزوار والجمهور العام (Anon / Public Users):</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              صلاحية <strong>SELECT</strong> فقط (Read-Only) لكافة المقالات المنشورة، ودليل المدارس، وجداول الإكسل الموثقة. لا يمكن لأي مستخدم غير مسجل التعديل أو الحذف إطلاقاً.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
            <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
              <span>المشرف المسجل (Authenticated Admin):</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              صلاحيات كاملة <strong>CRUD</strong> (Create, Read, Update, Delete) على الجداول الأربعة ورفع الوسائط لسلة تخزين Supabase Storage عبر جلسة مشفرة ومحمية بـ JWT.
            </p>
          </div>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="bg-[#051C2C] text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-hidden border border-[#0A3641]/30">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white/70">
          <span className="font-bold flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-[#E06D53]" />
            <span>supabase-schema.sql</span>
          </span>
          <button
            onClick={handleCopySql}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>
        </div>
        <pre className="overflow-x-auto max-h-72 leading-relaxed text-[11px] text-emerald-300">
          {FULL_SQL_SCRIPT}
        </pre>
      </div>

      {/* Deployment instructions */}
      <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#0A3641]/10 text-xs text-[#0A3641]/80 space-y-2">
        <div className="font-bold text-[#0A3641] flex items-center gap-1.5">
          <Key className="w-4 h-4 text-[#00A896]" />
          <span>طريقة تطبيق المخطط في حساب Supabase الخاص بك:</span>
        </div>
        <ol className="list-decimal list-inside space-y-1 ps-2 leading-relaxed">
          <li>انسخ الكود أعلاه باستخدام زر "نسخ كود SQL بنقرة واحدة".</li>
          <li>افتح لوحة تحكم Supabase واذهب إلى تبويب <strong>SQL Editor</strong>.</li>
          <li>الصق الكود واضغط <strong>Run</strong> لتوليد الجداول، وتفعيل سياسات RLS وسلة التخزين.</li>
          <li>
            ضع مفاتيح <code>VITE_SUPABASE_URL</code> و <code>VITE_SUPABASE_ANON_KEY</code> في ملف <code>.env.local</code>.
          </li>
        </ol>
      </div>
    </div>
  );
};
