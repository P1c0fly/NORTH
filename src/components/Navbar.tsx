import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  Menu,
  X,
  Compass,
  Building2,
  GraduationCap,
  BarChart3,
  BookOpen,
  Waves,
  Tag,
  Share2,
} from 'lucide-react';
import { BRAND_INFO } from '../data/initialData';
import { Category } from '../types';
import { WeatherBar } from './WeatherBar';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  categories,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const getCategoryIcon = (slugOrId: string) => {
    switch (slugOrId) {
      case 'news-development':
        return <Building2 className="w-4 h-4" />;
      case 'schools-directory':
        return <GraduationCap className="w-4 h-4" />;
      case 'projects-services':
        return <Compass className="w-4 h-4" />;
      case 'public-data':
        return <BarChart3 className="w-4 h-4" />;
      case 'analysis-guides':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const handleTabClick = (tabKey: string) => {
    onSelectTab(tabKey);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 border-b border-[#0C3552]/10 shadow-xs backdrop-blur-md">
      {/* Live Interactive Weather Bar for North Obhur (Open-Meteo Data) */}
      <WeatherBar />

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Identity & Logo */}
          <div
            id="brand-logo-container"
            onClick={() => handleTabClick('news-development')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-[#0C3552] via-[#051C2C] to-[#028090] p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0C3552] rounded-[14px] flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C29B63_1px,transparent_1px)] [background-size:6px_6px]"></div>
                <Waves className="w-5 h-5 text-[#028090] mb-0.5" />
                <span className="text-[9px] font-black tracking-tighter text-[#C29B63]">أبحر</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#0C3552] tracking-tight font-serif">
                  أبحر الشمالية
                </span>
                <span className="bg-[#C29B63]/15 text-[#AC8449] text-[11px] font-bold px-2 py-0.5 rounded-md border border-[#C29B63]/30">
                  {BRAND_INFO.handle}
                </span>
              </div>
              <p className="text-xs text-[#0C3552]/70 font-medium hidden sm:block">
                المنصة الإخبارية والرقمية الرائدة لمجتمع واستثمار أبحر الشمالية
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Bar */}
            <div className="relative hidden lg:block w-72">
              <input
                id="global-search-input"
                type="text"
                placeholder="ابحث عن خبر، مدرسة، مشروع، مخطط..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#F2ECE1] border border-[#0C3552]/15 rounded-xl py-2 ps-10 pe-4 text-sm text-[#0C3552] placeholder:text-[#0C3552]/50 focus:outline-none focus:ring-2 focus:ring-[#C29B63]/60 focus:border-[#C29B63] transition-all"
              />
              <Search className="w-4 h-4 text-[#0C3552]/50 absolute start-3 top-3" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute end-3 top-2.5 text-xs text-[#0C3552]/50 hover:text-[#0C3552]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              id="mobile-search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 rounded-xl text-[#0C3552] hover:bg-[#F2ECE1] border border-[#0C3552]/10"
              aria-label="بحث"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#0C3552] hover:bg-[#F2ECE1] border border-[#0C3552]/10"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input expansion */}
        {searchOpen && (
          <div className="mt-3 lg:hidden">
            <div className="relative">
              <input
                id="mobile-search-input"
                type="text"
                placeholder="ابحث عن خبر، مدرسة، مشروع، مخطط..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl py-2.5 ps-10 pe-4 text-sm text-[#0C3552] placeholder:text-[#0C3552]/50 focus:outline-none focus:ring-2 focus:ring-[#C29B63]"
              />
              <Search className="w-4 h-4 text-[#0C3552]/50 absolute start-3 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute end-3 top-3 text-xs text-[#0C3552]/50 hover:text-[#0C3552]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs Bar - Fully Functional for Schools, Projects, & All Sections */}
      <nav className="bg-[#F2ECE1] border-t border-[#0C3552]/10 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-1.5 py-1.5">
            {/* 1. الرئيسية / أخبار وتطوير */}
            <button
              id="nav-tab-news-development"
              onClick={() => handleTabClick('news-development')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'news-development' || activeTab === 'home'
                  ? 'bg-[#0C3552] text-white shadow-xs'
                  : 'text-[#0C3552] hover:bg-[#FAF8F5]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>أخبار وتطوير أبحر</span>
            </button>

            {/* 2. دليل المدارس المعتمدة (Fixed & Working) */}
            <button
              id="nav-tab-schools-directory"
              onClick={() => handleTabClick('schools-directory')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'schools-directory'
                  ? 'bg-[#0C3552] text-white shadow-xs'
                  : 'text-[#0C3552] hover:bg-[#FAF8F5]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>دليل المدارس</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'schools-directory'
                    ? 'bg-[#C29B63] text-white'
                    : 'bg-[#0C3552]/10 text-[#0C3552]'
                }`}
              >
                38
              </span>
            </button>

            {/* 3. مشاريع وخدمات أبحر (Fixed & Working) */}
            <button
              id="nav-tab-projects-services"
              onClick={() => handleTabClick('projects-services')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'projects-services'
                  ? 'bg-[#0C3552] text-white shadow-xs'
                  : 'text-[#0C3552] hover:bg-[#FAF8F5]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>مشاريع وخدمات أبحر</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'projects-services'
                    ? 'bg-[#C29B63] text-white'
                    : 'bg-[#0C3552]/10 text-[#0C3552]'
                }`}
              >
                12
              </span>
            </button>

            {/* 4. البيانات والمؤشرات العامة */}
            <button
              id="nav-tab-public-data"
              onClick={() => handleTabClick('public-data')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'public-data'
                  ? 'bg-[#0C3552] text-white shadow-xs'
                  : 'text-[#0C3552] hover:bg-[#FAF8F5]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>البيانات والمؤشرات</span>
            </button>

            {/* 5. حسابات ومنصات أبحر الرسمية (Requested: صفحه مخصصه لحسابات أبحر) */}
            <button
              id="nav-tab-social-hub"
              onClick={() => handleTabClick('social-hub')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'social-hub'
                  ? 'bg-[#0C3552] text-white shadow-xs'
                  : 'text-[#0C3552] hover:bg-[#FAF8F5]'
              }`}
            >
              <Share2 className="w-4 h-4 text-[#C29B63]" />
              <span>حسابات ومنصات أبحر</span>
              <span className="bg-[#C29B63]/20 text-[#AC8449] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                رسمي
              </span>
            </button>

            {/* Additional Custom or Dynamic Categories */}
            {categories
              .filter(
                (cat) =>
                  cat.slug !== 'news-development' &&
                  cat.slug !== 'schools-directory' &&
                  cat.slug !== 'projects-services' &&
                  cat.slug !== 'public-data'
              )
              .map((cat) => (
                <button
                  key={cat.id}
                  id={`nav-tab-${cat.slug}`}
                  onClick={() => handleTabClick(cat.slug)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === cat.slug
                      ? 'bg-[#0C3552] text-white shadow-xs'
                      : 'text-[#0C3552] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {getCategoryIcon(cat.slug)}
                  <span>{cat.name}</span>
                  {typeof cat.count === 'number' && cat.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        activeTab === cat.slug
                          ? 'bg-[#C29B63] text-white'
                          : 'bg-[#0C3552]/10 text-[#0C3552]'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
          </div>

          <div className="hidden xl:flex items-center gap-2 py-1 text-xs text-[#0C3552]/75 ps-4 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C29B63]"></span>
            <span>تغطية حية ومستمرة عبر {BRAND_INFO.handle}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-t border-[#0C3552]/15 p-4 shadow-xl">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleTabClick('news-development')}
              className={`p-3 text-start rounded-xl font-bold text-sm flex items-center gap-2 ${
                activeTab === 'news-development' || activeTab === 'home'
                  ? 'bg-[#0C3552] text-white'
                  : 'bg-[#F2ECE1] text-[#0C3552]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>أخبار وتطوير أبحر</span>
            </button>

            <button
              onClick={() => handleTabClick('schools-directory')}
              className={`p-3 text-start rounded-xl font-bold text-sm flex items-center justify-between ${
                activeTab === 'schools-directory'
                  ? 'bg-[#0C3552] text-white'
                  : 'bg-[#F2ECE1] text-[#0C3552]'
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>دليل المدارس</span>
              </div>
              <span className="text-xs opacity-80">(38 مدرسة)</span>
            </button>

            <button
              onClick={() => handleTabClick('projects-services')}
              className={`p-3 text-start rounded-xl font-bold text-sm flex items-center justify-between ${
                activeTab === 'projects-services'
                  ? 'bg-[#0C3552] text-white'
                  : 'bg-[#F2ECE1] text-[#0C3552]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>مشاريع وخدمات أبحر</span>
              </div>
              <span className="text-xs opacity-80">(12 مشروع)</span>
            </button>

            <button
              onClick={() => handleTabClick('public-data')}
              className={`p-3 text-start rounded-xl font-bold text-sm flex items-center gap-2 ${
                activeTab === 'public-data'
                  ? 'bg-[#0C3552] text-white'
                  : 'bg-[#F2ECE1] text-[#0C3552]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>البيانات والمؤشرات</span>
            </button>

            <button
              onClick={() => handleTabClick('social-hub')}
              className={`p-3 text-start rounded-xl font-bold text-sm flex items-center justify-between ${
                activeTab === 'social-hub'
                  ? 'bg-[#0C3552] text-white'
                  : 'bg-[#F2ECE1] text-[#0C3552]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#C29B63]" />
                <span>حسابات ومنصات أبحر الرسمية</span>
              </div>
              <span className="text-xs font-bold text-[#C29B63]">Linkfly</span>
            </button>

            {categories
              .filter(
                (c) =>
                  c.slug !== 'news-development' &&
                  c.slug !== 'schools-directory' &&
                  c.slug !== 'projects-services' &&
                  c.slug !== 'public-data'
              )
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleTabClick(cat.slug)}
                  className={`p-3 text-start rounded-xl font-bold text-sm flex items-center justify-between ${
                    activeTab === cat.slug
                      ? 'bg-[#0C3552] text-white'
                      : 'bg-[#F2ECE1] text-[#0C3552]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(cat.slug)}
                    <span>{cat.name}</span>
                  </div>
                  {typeof cat.count === 'number' && (
                    <span className="text-xs opacity-80">({cat.count})</span>
                  )}
                </button>
              ))}

            <div className="pt-3 border-t border-[#0C3552]/10 flex flex-col gap-2">
              <a
                href={BRAND_INFO.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0C3552] text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <span>متابعة {BRAND_INFO.handle} على X</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
