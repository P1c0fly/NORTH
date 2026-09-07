import { Article, Category, CommunityMetric, Project, RealEstateIndex, School } from '../types';
import {
  CATEGORIES,
  COMMUNITY_METRICS,
  INITIAL_ARTICLES,
  INITIAL_PROJECTS,
  INITIAL_SCHOOLS,
  REAL_ESTATE_STATS,
} from '../data/initialData';
import {
  supabase,
  isSupabaseConfigured,
  SupabaseExcelTableRow,
  getExcelTablesForArticle,
  saveExcelTableToSupabase,
} from '../lib/supabase/client';

const LOCAL_STORAGE_PREFIX = 'northabhor_';

function getStoredItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn('LocalStorage error:', e);
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// Convert Supabase article row to frontend Article type
function mapSupabaseArticleToClient(row: any, categories: Category[]): Article {
  const cat = categories.find((c) => c.id === row.category_id || c.slug === row.category_id);
  return {
    id: row.id,
    slug: row.slug || `art-${row.id}`,
    title: row.title,
    summary: row.excerpt || row.content.slice(0, 140) + '...',
    content: row.content,
    categoryId: row.category_id || 'news-development',
    categoryName: cat?.name || 'أخبار وتطوير الحي',
    coverImage: row.cover_image || 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: row.author_name || 'فريق تحرير @Northabhor',
      role: 'محرر الشؤون المحلية',
    },
    publishDate: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    readTimeMinutes: row.reading_time || 4,
    isBreaking: Boolean(row.is_breaking),
    isFeatured: Boolean(row.is_featured),
    tags: Array.isArray(row.tags) ? row.tags : typeof row.tags === 'string' ? JSON.parse(row.tags) : ['أبحر الشمالية'],
    views: row.views || 0,
  };
}

// Convert Supabase school row to frontend School type
function mapSupabaseSchoolToClient(row: any): School {
  return {
    id: row.id,
    name: row.name,
    type: row.type || 'عالمي',
    gender: row.gender || 'مشترك',
    stages: Array.isArray(row.stages) ? row.stages : ['ابتدائي', 'متوسط', 'ثانوي'],
    neighborhood: row.neighborhood || 'الياقوت',
    curriculum: row.curriculum || 'منهج وزاري ودولي',
    rating: Number(row.rating) || 4.5,
    reviewsCount: row.reviews_count || 18,
    feesRange: row.fees_range || '18,000 - 32,000 ر.س',
    phone: row.phone || '012-6000000',
    address: row.address || 'حي الياقوت - أبحر الشمالية',
    accredited: row.accredited ?? true,
  };
}

export const api = {
  // ==========================================
  // ARTICLES (Supabase `articles` Table)
  // ==========================================
  async getArticles(): Promise<Article[]> {
    // 1. Try Live Supabase Query first
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const cats = await this.getCategories();
          return data.map((row) => mapSupabaseArticleToClient(row, cats));
        }
      } catch (err) {
        console.warn('Supabase articles fetch failed, falling back:', err);
      }
    }

    // 2. Try Backend API
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // ignore
    }

    // 3. Local storage / Initial fallback
    return getStoredItem<Article[]>('articles', INITIAL_ARTICLES);
  },

  async saveArticle(article: Article): Promise<Article> {
    const current = await this.getArticles();
    const existingIndex = current.findIndex((a) => a.id === article.id);
    let updated: Article[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = article;
    } else {
      updated = [article, ...current];
    }
    setStoredItem('articles', updated);

    // 1. Sync to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('articles').upsert({
          id: article.id,
          title: article.title,
          slug: article.slug || `art-${article.id}`,
          content: article.content,
          excerpt: article.summary,
          category_id: article.categoryId,
          is_published: true,
          reading_time: article.readTimeMinutes || 3,
          cover_image: article.coverImage,
          tags: article.tags,
          is_breaking: article.isBreaking || false,
          is_featured: article.isFeatured || false,
        });
      } catch (err) {
        console.warn('Supabase article upsert error:', err);
      }
    }

    // 2. Sync to Backend Server API
    try {
      await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });
    } catch {
      // offline safe
    }

    return article;
  },

  async deleteArticle(id: string): Promise<void> {
    const current = await this.getArticles();
    const filtered = current.filter((a) => a.id !== id);
    setStoredItem('articles', filtered);

    // 1. Supabase deletion
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('articles').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    // 2. Backend Server deletion
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    } catch {
      // offline safe
    }
  },

  // ==========================================
  // CATEGORIES (Supabase `categories` Table)
  // ==========================================
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('created_at');
        if (!error && data && data.length > 0) {
          return data.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description,
          }));
        }
      } catch (err) {
        console.warn('Supabase categories fetch error:', err);
      }
    }

    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // ignore
    }

    return getStoredItem<Category[]>('categories', CATEGORIES);
  },

  async saveCategory(category: Category): Promise<Category> {
    const current = await this.getCategories();
    const idx = current.findIndex((c) => c.id === category.id || c.slug === category.slug);
    let updated: Category[];
    if (idx >= 0) {
      updated = [...current];
      updated[idx] = { ...updated[idx], ...category };
    } else {
      updated = [...current, category];
    }
    setStoredItem('categories', updated);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('categories').upsert({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
        });
      } catch (err) {
        console.warn('Supabase category upsert error:', err);
      }
    }

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
    } catch {
      // offline safe
    }
    return category;
  },

  async deleteCategory(id: string): Promise<void> {
    const current = await this.getCategories();
    const filtered = current.filter((c) => c.id !== id && c.slug !== id);
    setStoredItem('categories', filtered);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase category delete error:', err);
      }
    }

    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    } catch {
      // offline safe
    }
  },

  // ==========================================
  // SCHOOLS (Supabase `schools` Table)
  // ==========================================
  async getSchools(): Promise<School[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('schools').select('*').order('rating', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((row) => mapSupabaseSchoolToClient(row));
        }
      } catch (err) {
        console.warn('Supabase schools fetch error:', err);
      }
    }

    try {
      const res = await fetch('/api/schools');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // ignore
    }

    return getStoredItem<School[]>('schools', INITIAL_SCHOOLS);
  },

  async saveSchool(school: School): Promise<School> {
    const current = await this.getSchools();
    const idx = current.findIndex((s) => s.id === school.id);
    const updated = idx >= 0 ? current.map((s) => (s.id === school.id ? school : s)) : [school, ...current];
    setStoredItem('schools', updated);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('schools').upsert({
          id: school.id,
          name: school.name,
          type: school.type,
          rating: school.rating,
          gender: school.gender,
          stages: school.stages,
          neighborhood: school.neighborhood,
          curriculum: school.curriculum,
          fees_range: school.feesRange,
          phone: school.phone,
          address: school.address,
          accredited: school.accredited,
        });
      } catch (err) {
        console.warn('Supabase school upsert error:', err);
      }
    }

    try {
      await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(school),
      });
    } catch {
      // offline safe
    }

    return school;
  },

  async deleteSchool(id: string): Promise<void> {
    const current = await this.getSchools();
    setStoredItem(
      'schools',
      current.filter((s) => s.id !== id)
    );

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('schools').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase school delete error:', err);
      }
    }

    try {
      await fetch(`/api/schools/${id}`, { method: 'DELETE' });
    } catch {
      // offline safe
    }
  },

  // ==========================================
  // EXCEL TABLES (Supabase `excel_tables` Table)
  // ==========================================
  async getExcelTables(articleId?: string): Promise<SupabaseExcelTableRow[]> {
    if (isSupabaseConfigured() && articleId) {
      const live = await getExcelTablesForArticle(articleId);
      if (live.length > 0) return live;
    }

    try {
      const url = articleId ? `/api/excel-tables?articleId=${articleId}` : '/api/excel-tables';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // ignore
    }

    const stored = getStoredItem<SupabaseExcelTableRow[]>('excel_tables', []);
    if (articleId) {
      return stored.filter((t) => t.article_id === articleId);
    }
    return stored;
  },

  async saveExcelTable(table: SupabaseExcelTableRow): Promise<SupabaseExcelTableRow> {
    // 1. Supabase Cloud save
    if (isSupabaseConfigured()) {
      await saveExcelTableToSupabase(table);
    }

    // 2. Local storage
    const current = getStoredItem<SupabaseExcelTableRow[]>('excel_tables', []);
    const idx = current.findIndex((t) => t.id === table.id);
    const updated = idx >= 0 ? current.map((t) => (t.id === table.id ? table : t)) : [table, ...current];
    setStoredItem('excel_tables', updated);

    // 3. Backend API save
    try {
      await fetch('/api/excel-tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(table),
      });
    } catch {
      // ignore
    }

    return table;
  },

  // ==========================================
  // PROJECTS & STATS
  // ==========================================
  async getProjects(): Promise<Project[]> {
    return getStoredItem<Project[]>('projects', INITIAL_PROJECTS);
  },

  async saveProject(project: Project): Promise<Project> {
    const current = await this.getProjects();
    const idx = current.findIndex((p) => p.id === project.id);
    const updated = idx >= 0 ? current.map((p) => (p.id === project.id ? project : p)) : [project, ...current];
    setStoredItem('projects', updated);
    return project;
  },

  async getRealEstateStats(): Promise<RealEstateIndex[]> {
    return REAL_ESTATE_STATS;
  },

  async getMetrics(): Promise<CommunityMetric[]> {
    return COMMUNITY_METRICS;
  },
};
