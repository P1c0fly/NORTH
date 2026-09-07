-- ========================================================================
-- North Obhur (@Northabhor) Platform - Supabase PostgreSQL Schema Script
-- Theme: Jeddah Red Sea & North Obhur News, Schools & Data Hub
-- Compatible with Supabase SQL Editor & Migration Engine
-- ========================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if re-running (safe order)
-- DROP TABLE IF EXISTS public.excel_tables CASCADE;
-- DROP TABLE IF EXISTS public.articles CASCADE;
-- DROP TABLE IF EXISTS public.schools CASCADE;
-- DROP TABLE IF EXISTS public.categories CASCADE;

-- ------------------------------------------------------------------------
-- Table: Categories
-- Columns: id, name, slug, created_at
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ------------------------------------------------------------------------
-- Table: Articles
-- Columns: id, title, slug, content, excerpt, category_id, is_published, reading_time, created_at
-- Extra editorial fields: cover_image, tags, views, is_featured, is_breaking
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON public.articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_created ON public.articles(is_published, created_at DESC);

-- ------------------------------------------------------------------------
-- Table: Schools
-- Columns: id, name, type, rating, location_url, stats_json, created_at
-- Extra directory fields: gender, stages, neighborhood, curriculum, fees_range, phone, address, accredited
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schools (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- عالمي, أهلي, حكومي, حضانة ورياض أطفال
    rating NUMERIC(3, 2) DEFAULT 4.70,
    location_url TEXT,
    stats_json JSONB DEFAULT '{}'::jsonb,
    gender TEXT DEFAULT 'مشترك',
    stages JSONB DEFAULT '["ابتدائي", "متوسط", "ثانوي"]'::jsonb,
    neighborhood TEXT DEFAULT 'الياقوت',
    curriculum TEXT DEFAULT 'منهج وزاري ودولي متطور',
    fees_range TEXT DEFAULT '18,000 - 32,000 ر.س',
    phone TEXT DEFAULT '012-6000000',
    address TEXT,
    accredited BOOLEAN DEFAULT true,
    reviews_count INTEGER DEFAULT 25,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_schools_neighborhood ON public.schools(neighborhood);
CREATE INDEX IF NOT EXISTS idx_schools_type ON public.schools(type);

-- ------------------------------------------------------------------------
-- Table: Excel Tables
-- Columns: id, article_id, headers (jsonb), rows (jsonb), created_at
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.excel_tables (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    article_id TEXT REFERENCES public.articles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'جدول البيانات الإحصائي',
    headers JSONB NOT NULL DEFAULT '[]'::jsonb,
    rows JSONB NOT NULL DEFAULT '[]'::jsonb,
    source TEXT DEFAULT 'مركز بيانات أبحر الشمالية @Northabhor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_excel_tables_article_id ON public.excel_tables(article_id);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Requirements:
-- 1. Public Users: SELECT only (Read-only for all public views)
-- 2. Authenticated Admin: Full CRUD permissions (INSERT, SELECT, UPDATE, DELETE)
-- ========================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excel_tables ENABLE ROW LEVEL SECURITY;

-- 1. Categories Policies
DROP POLICY IF EXISTS "Public can view all categories" ON public.categories;
CREATE POLICY "Public can view all categories"
    ON public.categories FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can manage all categories" ON public.categories;
CREATE POLICY "Admins can manage all categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Articles Policies
DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
    ON public.articles FOR SELECT
    TO public
    USING (is_published = true);

DROP POLICY IF EXISTS "Admins can view and manage all articles" ON public.articles;
CREATE POLICY "Admins can view and manage all articles"
    ON public.articles FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Schools Policies
DROP POLICY IF EXISTS "Public can view all schools" ON public.schools;
CREATE POLICY "Public can view all schools"
    ON public.schools FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can manage all schools" ON public.schools;
CREATE POLICY "Admins can manage all schools"
    ON public.schools FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Excel Tables Policies
DROP POLICY IF EXISTS "Public can view excel tables" ON public.excel_tables;
CREATE POLICY "Public can view excel tables"
    ON public.excel_tables FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can manage all excel tables" ON public.excel_tables;
CREATE POLICY "Admins can manage all excel tables"
    ON public.excel_tables FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ========================================================================
-- SUPABASE STORAGE BUCKET: northabhor_media
-- Public Read, Authenticated Upload/Delete
-- ========================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('northabhor_media', 'northabhor_media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public view media" ON storage.objects;
CREATE POLICY "Public view media"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'northabhor_media');

DROP POLICY IF EXISTS "Admins upload media" ON storage.objects;
CREATE POLICY "Admins upload media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'northabhor_media');

DROP POLICY IF EXISTS "Admins update media" ON storage.objects;
CREATE POLICY "Admins update media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'northabhor_media');

DROP POLICY IF EXISTS "Admins delete media" ON storage.objects;
CREATE POLICY "Admins delete media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'northabhor_media');

-- ========================================================================
-- SEED INITIAL DATA (North Obhur @Northabhor Core Data)
-- ========================================================================

-- Categories Seed
INSERT INTO public.categories (id, name, slug, description)
VALUES 
    ('cat_news', 'أخبار وتطوير الحي', 'news-development', 'متابعة شاملة للمشاريع والقرارات وتطوير أحياء أبحر الشمالية'),
    ('cat_projects', 'مشاريع وخدمات أبحر', 'projects-services', 'مشاريع البنية التحتية، الجسور، وتطوير الواجهات البحرية'),
    ('cat_schools', 'دليل المدارس والتعليم', 'schools-directory', 'الدليل الشامل لكافة المدارس الأهلية والحكومية والعالمية بأبحر'),
    ('cat_data', 'البيانات والمؤشرات', 'public-data', 'إحصائيات عقارية وجداول رقمية تفاعلية موثقة')
ON CONFLICT (slug) DO NOTHING;

-- Articles Seed
INSERT INTO public.articles (
    id, title, slug, excerpt, content, category_id, is_published, reading_time, cover_image, is_breaking, is_featured, tags
) VALUES 
(
    'art_1',
    'إنجاز 85% من جسر أبحر المعلق وتجهيز مسارات الربط بين شمال وجنوب أبحر',
    'obhur-suspension-bridge-85-percent',
    'تجاوزت نسبة الإنجاز في مشروع جسر أبحر المعلق 85% وسط تسارع وتيرة الأعمال الإنشائية في الأبراج الرئيسية والكوابل الفولاذية لربط أحياء أبحر الشمالية مع طريق المدينة.',
    'تواصل الهيئة العامة للطرق وأمانة محافظة جدة تنفيذ المراحل المتقدمة من مشروع جسر أبحر المعلق الأيقوني، حيث بلغت نسبة الإنجاز الإجمالية 85%. يشمل المشروع 8 مسارات مرورية مع مسار مخصص للنقل العام وممشى مشاة وإطلالات بحرية بانورامية ساحرة تخدم سكان أحياء الياقوت والشراع والصواري وأبحر الجنوبية.',
    'cat_news',
    true,
    4,
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
    true,
    true,
    '["جسر أبحر", "مشاريع جدة", "أبحر الشمالية", "بنية تحتية"]'::jsonb
),
(
    'art_2',
    'تقرير مؤشرات أسعار العقار في أحياء أبحر الشمالية للربع الحالي',
    'north-obhur-real-estate-index-q1-2026',
    'كشف تقرير البيانات العقارية لحي الياقوت والشراع والصواري عن تسجيل متوسط سعر المتر السكني 3,450 ريال بارتفاع سنوي بلغ 8.2% مدفوعاً بطلب العائلات والمطورين.',
    'سجلت حركة التداولات العقارية في أحياء أبحر الشمالية نشاطاً استثنائياً خلال الربع الحالي، حيث تصدر حي الشراع والياقوت قائمة الأحياء الأكثر طلباً من قبل الأسر الباحثة عن السكن الراقي والفلل المستقلة القريبة من الخدمات والشواطئ البحرية المفتوحة.',
    'cat_data',
    true,
    5,
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    false,
    true,
    '["عقارات", "بيانات", "حي الياقوت", "حي الشراع"]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Schools Seed
INSERT INTO public.schools (
    id, name, type, rating, location_url, stats_json, gender, stages, neighborhood, curriculum, fees_range, phone, address, accredited
) VALUES 
(
    'sch_1',
    'مدارس أبحر العالمية الحديثة (Obhur International)',
    'عالمي',
    4.90,
    'https://maps.google.com/?q=21.758,39.112',
    '{"students_count": 850, "capacity": 1000, "teacher_student_ratio": "1:12"}'::jsonb,
    'مشترك',
    '["روضة", "ابتدائي", "متوسط", "ثانوي"]'::jsonb,
    'الياقوت',
    'منهج دولي أمريكي معتمد (AdvancED)',
    '24,000 - 38,000 ر.س',
    '012-6548899',
    'شارع الأمير عبدالمجيد - حي الياقوت',
    true
),
(
    'sch_2',
    'مجمع مدارس الشراع الأهلية النموذجية',
    'أهلي',
    4.80,
    'https://maps.google.com/?q=21.770,39.120',
    '{"students_count": 1200, "capacity": 1500, "teacher_student_ratio": "1:15"}'::jsonb,
    'مشترك',
    '["ابتدائي", "متوسط", "ثانوي"]'::jsonb,
    'الشراع',
    'المنهج الوزاري المطور مع مسارات لغات إثرائية',
    '16,000 - 26,000 ر.س',
    '012-6221144',
    'شارع عابر القارات - حي الشراع',
    true
),
(
    'sch_3',
    'ثانوية أبحر الشمالية الحكومية للبنين',
    'حكومي',
    4.65,
    'https://maps.google.com/?q=21.765,39.105',
    '{"students_count": 620, "capacity": 700, "teacher_student_ratio": "1:18"}'::jsonb,
    'بنين',
    '["ثانوي"]'::jsonb,
    'الصواري',
    'منهج وزارة التعليم بنظام المسارات',
    'مجاني (حكومي)',
    '012-6110022',
    'بجوار مركز الرعاية الصحية - حي الصواري',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Excel Table Sample Seed
INSERT INTO public.excel_tables (
    id, article_id, title, headers, rows, source
) VALUES (
    'tbl_1',
    'art_2',
    'جدول مؤشرات التداول العقاري وأسعار المتر بأحياء أبحر الشمالية (2026)',
    '["الحي", "متوسط سعر المتر السكني (ر.س)", "متوسط سعر المتر التجاري (ر.س)", "نسبة التغير السنوي", "مستوى النشاط", "أعلى طلب"]'::jsonb,
    '[
        ["حي الياقوت", "3,450", "5,200", "+8.2%", "مرتفع جداً", "فلل سكنية مستقلة"],
        ["حي الشراع", "3,150", "4,800", "+7.5%", "مرتفع", "أراضي سكنية وعمائر"],
        ["حي الصواري", "2,900", "4,400", "+6.8%", "متوسط", "شقق تمليك"],
        ["حي الأمواج", "3,800", "5,900", "+9.1%", "مرتفع جداً", "فلل وإطلالات لاجون"],
        ["حي الفردوس", "3,100", "4,500", "+6.2%", "متوسط", "أراضي سكنية"],
        ["حي الزمرد", "2,600", "3,900", "+5.4%", "متوسط", "استراحات وسكني"]
    ]'::jsonb,
    'الهيئة العامة للعقار وبوابة المؤشرات العقارية - تحليل @Northabhor'
)
ON CONFLICT (id) DO NOTHING;
