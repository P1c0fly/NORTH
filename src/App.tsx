import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BreakingTicker } from './components/BreakingTicker';
import { HeroSection } from './components/HeroSection';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { SchoolDirectory } from './components/SchoolDirectory';
import { ProjectsTracker } from './components/ProjectsTracker';
import { DataAnalyticsView } from './components/DataAnalyticsView';
import { AdminPanel } from './components/AdminPanel';
import { CoralReefBackground } from './components/CoralReefBackground';
import { SocialHub } from './components/SocialHub';
import { TweetImporter } from './components/TweetImporter';
import { Footer } from './components/Footer';
import { api } from './services/api';
import {
  INITIAL_ARTICLES,
  INITIAL_SCHOOLS,
  INITIAL_PROJECTS,
  INITIAL_REAL_ESTATE_INDEX,
  INITIAL_COMMUNITY_METRICS,
  CATEGORIES,
} from './data/initialData';
import { Article, School, Project, RealEstateIndex, CommunityMetric, Category } from './types';
import { Newspaper, Search, Layers, Compass, GraduationCap, BarChart3 } from 'lucide-react';

export default function App() {
  // Main Data States
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [realEstateStats] = useState<RealEstateIndex[]>(INITIAL_REAL_ESTATE_INDEX);
  const [communityMetrics] = useState<CommunityMetric[]>(INITIAL_COMMUNITY_METRICS);

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>('news-development');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals & Panels
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isTweetImporterOpen, setIsTweetImporterOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return (
      typeof window !== 'undefined' &&
      (window.location.hash === '#admin' || window.location.search.includes('admin=true'))
    );
  });

  // Fetch live data from backend API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedArticles, fetchedSchools, fetchedProjects, fetchedCategories] =
          await Promise.all([
            api.getArticles(),
            api.getSchools(),
            api.getProjects(),
            api.getCategories(),
          ]);
        if (fetchedArticles?.length) setArticles(fetchedArticles);
        if (fetchedSchools?.length) setSchools(fetchedSchools);
        if (fetchedProjects?.length) setProjects(fetchedProjects);
        if (fetchedCategories?.length) setCategories(fetchedCategories);
      } catch (err) {
        console.warn('Using local persistent data:', err);
      }
    };
    fetchData();
  }, []);

  // Hidden Admin Trigger: keyboard shortcut (Ctrl + Shift + A or Cmd + Shift + A) and hash listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'ش')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Filtered articles
  const filteredArticles = articles.filter((art) => {
    const matchSearch =
      !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());

    let matchCategory = true;
    if (activeTab !== 'news-development' && activeTab !== 'home' && activeTab !== 'schools-directory' && activeTab !== 'projects-services' && activeTab !== 'public-data') {
      // Direct category tab match
      matchCategory = art.categoryId === activeTab;
    } else if (selectedCategoryFilter !== 'all') {
      matchCategory = art.categoryId === selectedCategoryFilter;
    }

    const matchTag = !selectedTag || art.tags.includes(selectedTag);

    return matchSearch && matchCategory && matchTag;
  });

  // Articles & Schools & Projects CRUD
  const handleSaveArticle = async (article: Article) => {
    try {
      const saved = await api.saveArticle(article);
      setArticles((prev) => {
        const index = prev.findIndex((a) => a.id === saved.id);
        if (index >= 0) {
          const copy = [...prev];
          copy[index] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
    } catch (e) {
      console.error(e);
      setArticles((prev) => [article, ...prev.filter((a) => a.id !== article.id)]);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      await api.deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSaveSchool = async (school: School) => {
    try {
      const saved = await api.saveSchool(school);
      setSchools((prev) => {
        const index = prev.findIndex((s) => s.id === saved.id);
        if (index >= 0) {
          const copy = [...prev];
          copy[index] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
    } catch (e) {
      console.error(e);
      setSchools((prev) => [school, ...prev.filter((s) => s.id !== school.id)]);
    }
  };

  const handleDeleteSchool = async (id: string) => {
    try {
      await api.deleteSchool(id);
      setSchools((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
      setSchools((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSaveProject = async (project: Project) => {
    try {
      const saved = await api.saveProject(project);
      setProjects((prev) => {
        const index = prev.findIndex((p) => p.id === saved.id);
        if (index >= 0) {
          const copy = [...prev];
          copy[index] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
    } catch (e) {
      console.error(e);
      setProjects((prev) => [project, ...prev.filter((p) => p.id !== project.id)]);
    }
  };

  // Category CRUD Handlers (Requested: ضيف خيار اني اضيف اقسام و اعدل على اسماءه و غيره)
  const handleSaveCategory = async (category: Category) => {
    try {
      const saved = await api.saveCategory(category);
      setCategories((prev) => {
        const idx = prev.findIndex((c) => c.id === saved.id || c.slug === saved.slug);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        }
        return [...prev, saved];
      });
    } catch (e) {
      console.error(e);
      setCategories((prev) => {
        const filtered = prev.filter((c) => c.id !== category.id && c.slug !== category.slug);
        return [...filtered, category];
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id && c.slug !== id));
      if (activeTab === id) {
        setActiveTab('news-development');
      }
    } catch (e) {
      console.error(e);
      setCategories((prev) => prev.filter((c) => c.id !== id && c.slug !== id));
    }
  };

  // Tweet Importer batch save handler
  const handleImportArticles = async (importedArticles: Article[]) => {
    for (const art of importedArticles) {
      await handleSaveArticle(art);
    }
  };

  // Check if current tab is a news/category view
  const isNewsOrCategoryTab =
    activeTab === 'news-development' ||
    activeTab === 'home' ||
    (activeTab !== 'schools-directory' &&
      activeTab !== 'projects-services' &&
      activeTab !== 'public-data' &&
      activeTab !== 'social-hub');

  const currentCategoryObj = categories.find((c) => c.slug === activeTab);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0C3552] font-sans antialiased selection:bg-[#C29B63] selection:text-white flex flex-col justify-between relative overflow-x-hidden">
      {/* Subtle Red Sea Coral Reef Background Watermark */}
      <CoralReefBackground />

      {/* Main App Container */}
      <div className="relative z-10">
        {/* Top Navigation Bar with working tab switcher */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSelectedTag(null);
            if (tab === 'news-development' || tab === 'home') {
              setSelectedCategoryFilter('all');
            }
          }}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Live Breaking News Ticker */}
        <BreakingTicker
          articles={articles}
          onSelectArticle={(art) => setSelectedArticle(art)}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tag Filter Notification (if active) */}
          {selectedTag && (
            <div className="mt-4 p-3 bg-[#F2ECE1] rounded-xl flex items-center justify-between text-xs font-semibold text-[#0C3552] border border-[#0C3552]/10">
              <span>
                تصفية المقالات حسب الوسم: <strong className="text-[#028090]">#{selectedTag}</strong>
              </span>
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[#C29B63] hover:underline font-bold"
              >
                إلغاء التصفية
              </button>
            </div>
          )}

          {/* TAB 1 & Custom Categories: News, Articles & Developments Feed */}
          {isNewsOrCategoryTab && (
            <div>
              {/* Editorial Hero Banner (shown on home/news-development when no search/tag) */}
              {(activeTab === 'news-development' || activeTab === 'home') &&
                !selectedTag &&
                !searchQuery.trim() && (
                  <HeroSection
                    articles={articles}
                    onSelectArticle={(art) => setSelectedArticle(art)}
                    onNavigateTab={(tab) => {
                      setActiveTab(tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

              {/* Section Header & Category Filter Pills */}
              <div className="py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0C3552]/15 mb-6">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-[#028090]" />
                    <h2 className="text-xl sm:text-2xl font-black font-serif text-[#0C3552]">
                      {currentCategoryObj ? currentCategoryObj.name : 'الأخبار والتقارير الصحفية'}
                    </h2>
                    <span className="text-xs text-[#0C3552]/60 font-semibold">
                      ({filteredArticles.length} تقرير)
                    </span>
                  </div>

                  {/* Category Filter Pills (on news-development) */}
                  {(activeTab === 'news-development' || activeTab === 'home') && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      <button
                        onClick={() => setSelectedCategoryFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                          selectedCategoryFilter === 'all'
                            ? 'bg-[#0C3552] text-white shadow-xs'
                            : 'bg-[#F2ECE1] text-[#0C3552] hover:bg-white'
                        }`}
                      >
                        الكل
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategoryFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                            selectedCategoryFilter === cat.id
                              ? 'bg-[#0C3552] text-white shadow-xs'
                              : 'bg-[#F2ECE1] text-[#0C3552] hover:bg-white'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Articles Grid */}
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onSelect={(art) => setSelectedArticle(art)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#F2ECE1] rounded-3xl p-10 text-center border border-[#0C3552]/10">
                    <Search className="w-8 h-8 text-[#0C3552]/40 mx-auto mb-2" />
                    <h3 className="font-bold text-base text-[#0C3552] mb-1">لا توجد تقارير مطابقة</h3>
                    <p className="text-xs text-[#0C3552]/60">
                      جرب تغيير معايير البحث أو اختيار تصنيف آخر من القائمة.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: School Directory (Fixed & Working) */}
          {activeTab === 'schools-directory' && (
            <div className="py-6">
              <SchoolDirectory schools={schools} />
            </div>
          )}

          {/* TAB 3: Projects & Infrastructure Tracker (Fixed & Working) */}
          {activeTab === 'projects-services' && (
            <div className="py-6">
              <ProjectsTracker projects={projects} />
            </div>
          )}

          {/* TAB 4: Public Data & Real Estate Analytics */}
          {activeTab === 'public-data' && (
            <div className="py-6">
              <DataAnalyticsView metrics={communityMetrics} stats={realEstateStats} />
            </div>
          )}

          {/* TAB 5: Dedicated Social Hub Page (Requested: https://linkfly.to/60512dkhz5h و سو له صفحه مخصصه) */}
          {activeTab === 'social-hub' && (
            <div className="py-6">
              <SocialHub />
            </div>
          )}
        </main>
      </div>

      {/* Modals & Readers */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onSelectTag={(tag) => {
          setSelectedTag(tag);
          setActiveTab('news-development');
        }}
      />

      {/* Tweet Importer Modal (Requested: خيار استيراد التغريدات من حساب ابحر) */}
      <TweetImporter
        isOpen={isTweetImporterOpen}
        onClose={() => setIsTweetImporterOpen(false)}
        onImportArticles={handleImportArticles}
      />

      {/* Hidden & Strongly Encrypted Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', window.location.pathname);
          }
        }}
        articles={articles}
        schools={schools}
        projects={projects}
        categories={categories}
        onSaveArticle={handleSaveArticle}
        onDeleteArticle={handleDeleteArticle}
        onSaveSchool={handleSaveSchool}
        onDeleteSchool={handleDeleteSchool}
        onSaveProject={handleSaveProject}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        onOpenTweetImporter={() => setIsTweetImporterOpen(true)}
      />

      {/* Footer */}
      <Footer
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
