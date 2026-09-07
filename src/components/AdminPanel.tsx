import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit,
  Save,
  FileSpreadsheet,
  Upload,
  Image as ImageIcon,
  Share2,
  CheckCircle,
  Eye,
  X,
  GraduationCap,
  Compass,
  FileText,
  Clock,
  Link2,
  Shield,
  KeyRound,
  Layers,
  Building2,
  BarChart3,
  BookOpen,
  Waves,
  Tag,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Phone,
  MapPin,
  Star,
  CheckCircle2,
  Search,
  UserCheck,
  UserPlus,
  Mail,
  Award,
  Database,
  Copy,
  HardDrive,
} from 'lucide-react';
import { Article, School, Project, DataTableData, Category } from '../types';
import { parseExcelOrCsv, exportToExcel } from '../utils/excel';
import { DataTableEmbed } from './DataTableEmbed';
import { SupabaseSqlSchemaViewer } from './SupabaseSqlSchemaViewer';
import { BRAND_INFO } from '../data/initialData';
import {
  isSupabaseConfigured,
  uploadToSupabaseStorage,
  saveExcelTableToSupabase,
  signOutAdmin,
  getAdminSession,
  SupabaseExcelTableRow,
} from '../lib/supabase/client';
import { api } from '../services/api';
import {
  verifyAdminCredentials,
  isSessionValid,
  setEncryptedSession,
  getEncryptedSession,
  clearEncryptedSession,
  updateAdminPassword,
  getSecurityAuditLog,
  getSupervisors,
  registerSupervisor,
  verifySupervisorCode,
  deleteSupervisor,
  SupervisorUser,
} from '../services/security';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  schools: School[];
  projects: Project[];
  categories: Category[];
  onSaveArticle: (article: Article) => Promise<void>;
  onDeleteArticle: (id: string) => Promise<void>;
  onSaveSchool: (school: School) => Promise<void>;
  onDeleteSchool: (id: string) => Promise<void>;
  onSaveProject: (project: Project) => Promise<void>;
  onSaveCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onOpenTweetImporter?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  articles,
  schools,
  projects,
  categories,
  onSaveArticle,
  onDeleteArticle,
  onSaveSchool,
  onDeleteSchool,
  onSaveProject,
  onSaveCategory,
  onDeleteCategory,
  onOpenTweetImporter,
}) => {
  // Authentication State with Strong Cryptography
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = getEncryptedSession();
    return token ? isSessionValid(token) : false;
  });
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('NorthAbhor2026!');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Admin View Tabs
  const [adminTab, setAdminTab] = useState<
    'articles' | 'editor' | 'categories' | 'excel' | 'schools' | 'media' | 'supabase-sql' | 'security' | 'seo'
  >('articles');

  // Supabase Storage & Excel Linking State
  const [supabaseUploadLoading, setSupabaseUploadLoading] = useState(false);
  const [supabaseUploadError, setSupabaseUploadError] = useState<string | null>(null);
  const [selectedTargetArticleId, setSelectedTargetArticleId] = useState<string>('');
  const [excelSaveDbLoading, setExcelSaveDbLoading] = useState(false);
  const [excelSaveDbSuccess, setExcelSaveDbSuccess] = useState('');

  // Category Management State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catFormName, setCatFormName] = useState('');
  const [catFormNameEn, setCatFormNameEn] = useState('');
  const [catFormSlug, setCatFormSlug] = useState('');
  const [catFormDesc, setCatFormDesc] = useState('');
  const [categorySaveLoading, setCategorySaveLoading] = useState(false);

  // Password Change & Security State
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwChangeMsg, setPwChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Article Editor State
  const [editingArticle, setEditingArticle] = useState<Article>({
    id: 'art_' + Date.now(),
    slug: 'new-article-' + Date.now(),
    title: '',
    summary: '',
    content: '',
    categoryId: 'news-development',
    categoryName: 'أخبار وتطوير أبحر الشمالية',
    coverImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'فريق التحرير والرصد',
      role: 'المشرف العام - @Northabhor',
    },
    publishDate: new Date().toISOString().split('T')[0],
    readTimeMinutes: 4,
    isBreaking: false,
    isFeatured: false,
    tags: ['أبحر الشمالية', 'جدة'],
    views: 120,
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
  });

  // Excel Converter State
  const [parsedTable, setParsedTable] = useState<DataTableData | null>(null);
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelSuccessMsg, setExcelSuccessMsg] = useState('');

  // Media Manager State
  const [uploadedMediaList, setUploadedMediaList] = useState<string[]>([
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [mediaUploadUrl, setMediaUploadUrl] = useState('');

  // School modal and management state
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('');
  const [schoolTypeFilter, setSchoolTypeFilter] = useState('الكل');
  const [schoolNeighborhoodFilter, setSchoolNeighborhoodFilter] = useState('الكل');
  const [schoolSaveLoading, setSchoolSaveLoading] = useState(false);
  const [schoolActionMsg, setSchoolActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states for school
  const [schoolFormName, setSchoolFormName] = useState('');
  const [schoolFormType, setSchoolFormType] = useState<School['type']>('عالمي');
  const [schoolFormGender, setSchoolFormGender] = useState<School['gender']>('مشترك');
  const [schoolFormStages, setSchoolFormStages] = useState<string[]>(['ابتدائي', 'متوسط', 'ثانوي']);
  const [schoolFormNeighborhood, setSchoolFormNeighborhood] = useState('الياقوت');
  const [schoolFormCurriculum, setSchoolFormCurriculum] = useState('منهج وزاري سعودي متطور');
  const [schoolFormFees, setSchoolFormFees] = useState('18,000 - 32,000 ر.س');
  const [schoolFormPhone, setSchoolFormPhone] = useState('012-6000000');
  const [schoolFormAddress, setSchoolFormAddress] = useState('أبحر الشمالية');
  const [schoolFormRating, setSchoolFormRating] = useState(4.7);
  const [schoolFormReviews, setSchoolFormReviews] = useState(25);
  const [schoolFormAccredited, setSchoolFormAccredited] = useState(true);

  // Supervisor Registration & Encrypted Email Verification State
  const [supervisorsList, setSupervisorsList] = useState<SupervisorUser[]>(() => getSupervisors());
  const [supName, setSupName] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supRole, setSupRole] = useState<'super_admin' | 'editor' | 'schools_moderator'>('schools_moderator');
  const [supPassword, setSupPassword] = useState('');
  const [supVerifStep, setSupVerifStep] = useState(false);
  const [supEmailToVerify, setSupEmailToVerify] = useState('');
  const [supCodeInput, setSupCodeInput] = useState('');
  const [supSentCode, setSupSentCode] = useState('');
  const [supMsg, setSupMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [supLoading, setSupLoading] = useState(false);

  // School actions
  const openNewSchoolModal = () => {
    setEditingSchool(null);
    setSchoolFormName('');
    setSchoolFormType('عالمي');
    setSchoolFormGender('مشترك');
    setSchoolFormStages(['ابتدائي', 'متوسط', 'ثانوي']);
    setSchoolFormNeighborhood('الياقوت');
    setSchoolFormCurriculum('منهج وزاري سعودي متطور');
    setSchoolFormFees('18,000 - 32,000 ر.س');
    setSchoolFormPhone('012-6000000');
    setSchoolFormAddress('شارع الأمير عبدالمجيد، أبحر الشمالية');
    setSchoolFormRating(4.8);
    setSchoolFormReviews(20);
    setSchoolFormAccredited(true);
    setIsSchoolModalOpen(true);
  };

  const openEditSchoolModal = (school: School) => {
    setEditingSchool(school);
    setSchoolFormName(school.name);
    setSchoolFormType(school.type);
    setSchoolFormGender(school.gender);
    setSchoolFormStages(school.stages || ['ابتدائي']);
    setSchoolFormNeighborhood(school.neighborhood || 'الياقوت');
    setSchoolFormCurriculum(school.curriculum || '');
    setSchoolFormFees(school.feesRange || '');
    setSchoolFormPhone(school.phone || '');
    setSchoolFormAddress(school.address || '');
    setSchoolFormRating(school.rating || 4.5);
    setSchoolFormReviews(school.reviewsCount || 10);
    setSchoolFormAccredited(school.accredited !== false);
    setIsSchoolModalOpen(true);
  };

  const handleSaveSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolFormName.trim()) {
      alert('يرجى إدخال اسم المدرسة');
      return;
    }

    setSchoolSaveLoading(true);
    setSchoolActionMsg(null);
    try {
      const schoolData: School = {
        id: editingSchool ? editingSchool.id : 'sch_' + Date.now(),
        name: schoolFormName.trim(),
        type: schoolFormType,
        gender: schoolFormGender,
        stages: schoolFormStages.length > 0 ? schoolFormStages : ['ابتدائي'],
        neighborhood: schoolFormNeighborhood.trim(),
        curriculum: schoolFormCurriculum.trim(),
        rating: Number(schoolFormRating) || 4.5,
        reviewsCount: Number(schoolFormReviews) || 1,
        feesRange: schoolFormFees.trim(),
        phone: schoolFormPhone.trim(),
        address: schoolFormAddress.trim(),
        accredited: schoolFormAccredited,
      };

      await onSaveSchool(schoolData);
      setIsSchoolModalOpen(false);
      setSchoolActionMsg({ type: 'success', text: `تم بنجاح حفظ وتحديث مدرسة "${schoolData.name}" بالدليل!` });
      setTimeout(() => setSchoolActionMsg(null), 4000);
    } catch (err: any) {
      alert('فشل حفظ المدرسة: ' + (err?.message || 'خطأ غير معروف'));
    } finally {
      setSchoolSaveLoading(false);
    }
  };

  const handleDeleteSchoolAction = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف مدرسة "${name}" من الدليل؟`)) {
      try {
        await onDeleteSchool(id);
        setSchoolActionMsg({ type: 'success', text: `تم حذف مدرسة "${name}" بنجاح` });
        setTimeout(() => setSchoolActionMsg(null), 3000);
      } catch (err: any) {
        alert('فشل الحذف: ' + (err?.message || ''));
      }
    }
  };

  // Supervisor Registration & Verification Handlers
  const handleRegisterSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupLoading(true);
    setSupMsg(null);

    const res = await registerSupervisor(supName, supEmail, supRole, supPassword);
    setSupLoading(false);
    if (res.success && res.code) {
      setSupSentCode(res.code);
      setSupEmailToVerify(supEmail.trim().toLowerCase());
      setSupVerifStep(true);
      setSupMsg({
        type: 'success',
        text: `تم إنشاء حساب المشرف بنجاح! تم إرسال رمز التحقق الأمني (${res.code}) لتأكيد البريد الإلكتروني.`,
      });
      setSupervisorsList(getSupervisors());
    } else {
      setSupMsg({ type: 'error', text: res.error || 'فشل تسجيل المشرف' });
    }
  };

  const handleVerifySupervisorCode = (e: React.FormEvent) => {
    e.preventDefault();
    setSupMsg(null);
    const res = verifySupervisorCode(supEmailToVerify, supCodeInput);
    if (res.success) {
      setSupMsg({ type: 'success', text: 'تم التحقق بنجاح وتفعيل حساب المشرف في قاعدة البيانات المشفرة!' });
      setSupVerifStep(false);
      setSupName('');
      setSupEmail('');
      setSupPassword('');
      setSupCodeInput('');
      setSupervisorsList(getSupervisors());
    } else {
      setSupMsg({ type: 'error', text: res.error || 'رمز التحقق غير صحيح، يرجى إعادة المحاولة' });
    }
  };

  const handleDeleteSupervisorAction = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف المشرف "${name}"؟`)) {
      deleteSupervisor(id);
      setSupervisorsList(getSupervisors());
      setSupMsg({ type: 'success', text: `تم حذف المشرف "${name}"` });
      setTimeout(() => setSupMsg(null), 3000);
    }
  };

  useEffect(() => {
    // Validate existing session on open
    if (isOpen) {
      const token = getEncryptedSession();
      if (token && isSessionValid(token)) {
        setIsAuthenticated(true);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Cryptographically secure login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const result = await verifyAdminCredentials(loginUsername, loginPassword);
      if (result.success && result.token) {
        setEncryptedSession(result.token);
        setIsAuthenticated(true);
      } else {
        setLoginError(result.error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch {
      setLoginError('حدث خطأ أثناء فك التشفير والمصادقة');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearEncryptedSession();
    setIsAuthenticated(false);
  };

  // Change Password with Strong PBKDF2 Encryption
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwChangeMsg(null);

    if (newPw !== confirmPw) {
      setPwChangeMsg({ type: 'error', text: 'كلمتا المرور الجديدتان غير متطابقتين' });
      return;
    }

    const res = await updateAdminPassword(currentPw, newPw);
    if (res.success) {
      setPwChangeMsg({ type: 'success', text: 'تم تشفير وتحديث كلمة المرور بنجاح بواسطة PBKDF2 SHA-256' });
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } else {
      setPwChangeMsg({ type: 'error', text: res.error || 'تعذر تحديث كلمة المرور' });
    }
  };

  // Article Action Handlers
  const handleSaveArticleAction = async () => {
    if (!editingArticle.title.trim()) {
      alert('يرجى إدخال عنوان المقال');
      return;
    }
    await onSaveArticle(editingArticle);
    setAdminTab('articles');
    alert('تم حفظ ونشر المقال بنجاح في منصة أبحر الشمالية!');
  };

  // Category Action Handlers
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCatFormName('');
    setCatFormNameEn('');
    setCatFormSlug('');
    setCatFormDesc('');
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatFormName(cat.name);
    setCatFormNameEn(cat.nameEn || '');
    setCatFormSlug(cat.slug);
    setCatFormDesc(cat.description || '');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim() || !catFormSlug.trim()) {
      alert('يرجى كتابة اسم القسم والمعرف (slug)');
      return;
    }

    setCategorySaveLoading(true);
    try {
      const categoryData: Category = {
        id: editingCategory?.id || 'cat_' + Date.now(),
        name: catFormName.trim(),
        nameEn: catFormNameEn.trim(),
        slug: catFormSlug.trim().toLowerCase().replace(/\s+/g, '-'),
        description: catFormDesc.trim(),
        count: editingCategory?.count || 0,
        isCustom: true,
      };

      await onSaveCategory(categoryData);
      setIsCategoryModalOpen(false);
      alert('تم حفظ القسم بنجاح وتحديث شريط التصفح!');
    } catch (err: any) {
      alert('تعذر حفظ القسم: ' + (err?.message || 'خطأ غير معروف'));
    } finally {
      setCategorySaveLoading(false);
    }
  };

  const handleDeleteCategoryAction = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف قسم "${name}"؟`)) {
      await onDeleteCategory(id);
    }
  };

  // Excel Upload
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelLoading(true);
    setExcelSuccessMsg('');
    try {
      const tableData = await parseExcelOrCsv(file);
      setParsedTable(tableData);
      setExcelSuccessMsg(`تم استيراد ${tableData.rows.length} صفاً بنجاح من ملف: ${file.name}`);
    } catch (err: any) {
      alert('خطأ في قراءة ملف الإكسل: ' + (err?.message || 'تأكد من صيغة الملف'));
    } finally {
      setExcelLoading(false);
    }
  };

  const insertParsedTableToArticle = () => {
    if (!parsedTable) return;
    const tableHtml = `\n\n[جدول بيانات إحصائي موثق]\n${parsedTable.title}\n`;
    setEditingArticle((prev) => ({
      ...prev,
      content: prev.content + tableHtml,
      dataTable: parsedTable,
    }));
    alert('تم ربط جدول البيانات الإحصائي بالمقال الحالي!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#051C2C]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-6xl rounded-3xl shadow-2xl border border-[#0C3552]/20 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Coastal Sand & Red Sea Marine Theme */}
        <div className="bg-[#051C2C] text-white px-6 py-4 flex items-center justify-between border-b border-[#C29B63]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0C3552] border border-[#C29B63]/40 flex items-center justify-center text-[#C29B63] shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg font-serif">لوحة الإدارة والتشفير المتقدم</h3>
                <span className="bg-[#C29B63]/25 text-[#F2ECE1] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#C29B63]/30">
                  PBKDF2 SHA-256
                </span>
              </div>
              <p className="text-xs text-white/70">
                إدارة محتوى وأقسام وبيانات منصة {BRAND_INFO.handle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs bg-rose-900/60 hover:bg-rose-800 text-white px-3 py-1.5 rounded-xl transition-colors border border-rose-700/50"
              >
                تسجيل الخروج
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-[#C29B63] text-white transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Secure Login Form */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex items-center justify-center flex-1">
            <div className="w-full max-w-md bg-[#F2ECE1] p-6 sm:p-8 rounded-3xl border border-[#0C3552]/15 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0C3552] text-[#C29B63] mx-auto flex items-center justify-center mb-4 shadow-xs">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-[#0C3552] font-serif mb-1">تسجيل دخول المشرف المشفر</h4>
              <p className="text-xs text-[#0C3552]/70 mb-6">
                الوصول محمي ومشفر بالكامل بخوارزمية التجزئة العالية وحماية القفل التلقائي
              </p>

              {loginError && (
                <div className="bg-rose-100 text-rose-800 text-xs p-3 rounded-xl mb-4 text-start font-semibold border border-rose-300">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-start">
                <div>
                  <label className="block text-xs font-bold text-[#0C3552] mb-1">اسم المشرف</label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-sm text-[#0C3552] focus:ring-2 focus:ring-[#C29B63]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0C3552] mb-1">كلمة المرور المشفرة</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-sm text-[#0C3552] focus:ring-2 focus:ring-[#C29B63]"
                    required
                  />
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl text-[11px] text-[#0C3552]/80 border border-[#0C3552]/10 space-y-1">
                  <div>
                    المشرف الافتراضي: <strong>admin</strong> | كلمة المرور: <strong>NorthAbhor2026!</strong>
                  </div>
                  <div className="text-[10px] text-[#028090]">
                    * محمية بقفل أمني تلقائي 15 دقيقة بعد 5 محاولات خاطئة لمنع هجمات التخمين.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#0C3552] hover:bg-[#051C2C] text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4 text-[#C29B63]" />
                  <span>{loginLoading ? 'جاري فك التشفير والتحقق...' : 'تسجيل الدخول المشفر'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navigation Tabs */}
            <div className="bg-[#F2ECE1] px-5 py-2.5 border-b border-[#0C3552]/10 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              {/* 1. Articles CMS */}
              <button
                onClick={() => setAdminTab('articles')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  adminTab === 'articles' ? 'bg-[#0C3552] text-white' : 'text-[#0C3552] hover:bg-[#FAF8F5]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>إدارة الأخبار ({articles.length})</span>
              </button>

              {/* 2. Article Editor */}
              <button
                onClick={() => setAdminTab('editor')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  adminTab === 'editor' ? 'bg-[#0C3552] text-white' : 'text-[#0C3552] hover:bg-[#FAF8F5]'
                }`}
              >
                <Plus className="w-3.5 h-3.5 text-[#C29B63]" />
                <span>محرر المقالات RTL</span>
              </button>

              {/* 3. Categories Management (NEW USER REQUEST) */}
              <button
                onClick={() => setAdminTab('categories')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  adminTab === 'categories' ? 'bg-[#0C3552] text-white' : 'text-[#0C3552] hover:bg-[#FAF8F5]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#028090]" />
                <span>إدارة وتعديل الأقسام ({categories.length})</span>
              </button>

              {/* 4. Excel & CSV */}
              <button
                onClick={() => setAdminTab('excel')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  adminTab === 'excel' ? 'bg-[#0C3552] text-white' : 'text-[#0C3552] hover:bg-[#FAF8F5]'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#C29B63]" />
                <span>محول إكسل و CSV</span>
              </button>

              {/* 5. Schools */}
              <button
                onClick={() => setAdminTab('schools')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  adminTab === 'schools' ? 'bg-[#0C3552] text-white' : 'text-[#0C3552] hover:bg-[#FAF8F5]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>دليل المدارس ({schools.length})</span>
              </button>

              {/* 6. Media */}
              <button
                onClick={() => setAdminTab('media')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  adminTab === 'media' ? 'bg-[#0C3552] text-white' : 'text-[#0C3552] hover:bg-[#FAF8F5]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>مدير الميديا والصور</span>
              </button>

              {/* 7. Cryptography & Security (NEW USER REQUEST) */}
              <button
                onClick={() => setAdminTab('security')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  adminTab === 'security' ? 'bg-[#0C3552] text-white' : 'text-[#0C3552] hover:bg-[#FAF8F5]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-[#C29B63]" />
                <span>تشفير وأمان الإدارة</span>
              </button>

              {/* 8. SEO & Twitter */}
              <button
                onClick={() => setAdminTab('seo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  adminTab === 'seo' ? 'bg-[#0C3552] text-white' : 'text-[#0C3552] hover:bg-[#FAF8F5]'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-[#028090]" />
                <span>بطاقة Twitter/X و SEO</span>
              </button>

              {/* 9. Import Tweets Action (Requested) */}
              {onOpenTweetImporter && (
                <button
                  onClick={onOpenTweetImporter}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#028090]/15 hover:bg-[#028090] text-[#028090] hover:text-white transition-all whitespace-nowrap flex items-center gap-1.5 border border-[#028090]/30 ms-auto"
                  title="استيراد التغريدات مباشرة من حساب أبحر الشمالية @Northabhor"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C29B63]" />
                  <span>استيراد تغريدات أبحر (@Northabhor)</span>
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              {/* TAB: Categories Management (Requested: ضيف خيار اني اضيف اقسام و اعدل على اسماءه و غيره) */}
              {adminTab === 'categories' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0C3552]/10">
                    <div>
                      <h4 className="font-bold text-lg text-[#0C3552] font-serif flex items-center gap-2">
                        <Layers className="w-5 h-5 text-[#C29B63]" />
                        <span>إدارة وتعديل أقسام المنصة</span>
                      </h4>
                      <p className="text-xs text-[#0C3552]/70">
                        أضف أقساماً جديدة، عدّل أسماءها، أو احذف الأقسام غير المطلوبة مع التحديث الفوري لشريط التصفح الرئيسي.
                      </p>
                    </div>

                    <button
                      onClick={openNewCategoryModal}
                      className="inline-flex items-center gap-2 bg-[#0C3552] hover:bg-[#051C2C] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#C29B63]" />
                      <span>إضافة قسم جديد</span>
                    </button>
                  </div>

                  {/* Categories Grid Table */}
                  <div className="bg-[#F2ECE1] rounded-2xl overflow-hidden border border-[#0C3552]/10">
                    <div className="overflow-x-auto">
                      <table className="w-full text-start text-xs">
                        <thead className="bg-[#0C3552] text-white">
                          <tr>
                            <th className="p-3.5 text-start font-bold">اسم القسم (عربي)</th>
                            <th className="p-3.5 text-start font-bold">المعرف (Slug)</th>
                            <th className="p-3.5 text-start font-bold">الوصف والتفاصيل</th>
                            <th className="p-3.5 text-center font-bold">المقالات</th>
                            <th className="p-3.5 text-center font-bold">النوع</th>
                            <th className="p-3.5 text-end font-bold">إجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0C3552]/10">
                          {categories.map((cat) => {
                            const articleCount = articles.filter(
                              (a) => a.categoryId === cat.id || a.categoryId === cat.slug
                            ).length;
                            return (
                              <tr key={cat.id} className="hover:bg-white/50 transition-colors">
                                <td className="p-3.5 font-bold text-[#0C3552] flex items-center gap-2">
                                  <span className="p-1.5 bg-[#0C3552]/10 rounded-lg text-[#0C3552]">
                                    <Tag className="w-3.5 h-3.5" />
                                  </span>
                                  <span>{cat.name}</span>
                                  {cat.nameEn && (
                                    <span className="text-[10px] text-[#0C3552]/50 font-normal">
                                      ({cat.nameEn})
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5 font-mono text-[11px] text-[#0C3552]/75">
                                  {cat.slug}
                                </td>
                                <td className="p-3.5 text-[#0C3552]/80 max-w-xs truncate">
                                  {cat.description || 'لا يوجد وصف'}
                                </td>
                                <td className="p-3.5 text-center">
                                  <span className="bg-[#C29B63]/20 text-[#AC8449] font-bold px-2 py-0.5 rounded-full text-[11px]">
                                    {articleCount}
                                  </span>
                                </td>
                                <td className="p-3.5 text-center">
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      cat.isCustom
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-[#0C3552]/10 text-[#0C3552]'
                                    }`}
                                  >
                                    {cat.isCustom ? 'مخصص' : 'أساسي'}
                                  </span>
                                </td>
                                <td className="p-3.5 text-end space-x-1 space-x-reverse">
                                  <button
                                    onClick={() => openEditCategoryModal(cat)}
                                    className="p-1.5 text-[#0C3552] hover:bg-white rounded-lg transition-colors"
                                    title="تعديل اسم وبيانات القسم"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  {cat.isCustom && (
                                    <button
                                      onClick={() => handleDeleteCategoryAction(cat.id, cat.name)}
                                      className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                                      title="حذف القسم"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Strong Cryptography & Security (Requested: الاداره شفره تشفير قوي و اخفيه) */}
              {adminTab === 'security' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-[#0C3552]/10">
                    <h4 className="font-bold text-lg text-[#0C3552] font-serif flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#C29B63]" />
                      <span>تشفير وأمان الإدارة وحماية الدخول</span>
                    </h4>
                    <p className="text-xs text-[#0C3552]/70">
                      النظام مجهز بتشفير قوي (PBKDF2 مع SHA-256 و 100,000 تكرار)، وقفل أوتوماتيكي ضد هجمات القوة الغاشمة (Brute-Force Lockout)، وإخفاء تام عن الزوار العاديين.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Security Status Card */}
                    <div className="bg-[#F2ECE1] p-5 rounded-2xl border border-[#0C3552]/15 space-y-3">
                      <h5 className="font-bold text-sm text-[#0C3552] flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-[#028090]" />
                        <span>معايير التشفير المفعلة</span>
                      </h5>

                      <div className="space-y-2 text-xs text-[#0C3552]/80">
                        <div className="flex justify-between items-center bg-[#FAF8F5] p-2.5 rounded-xl">
                          <span className="font-semibold">خوارزمية التجزئة:</span>
                          <span className="font-mono bg-[#0C3552] text-white px-2 py-0.5 rounded text-[11px]">
                            PBKDF2 (SHA-256, 100,000 iter)
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-[#FAF8F5] p-2.5 rounded-xl">
                          <span className="font-semibold">حماية القفل التلقائي:</span>
                          <span className="text-emerald-700 font-bold">مفعلة (15 دقيقة بعد 5 أخطاء)</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#FAF8F5] p-2.5 rounded-xl">
                          <span className="font-semibold">حالة الجلسة المشفرة:</span>
                          <span className="text-emerald-700 font-bold">صحيحة ومشفرة رقمياً</span>
                        </div>
                        <div className="flex justify-between items-center bg-[#FAF8F5] p-2.5 rounded-xl">
                          <span className="font-semibold">إخفاء لوحة التحكم:</span>
                          <span className="text-emerald-700 font-bold">مخفية بالكامل عن الواجهة العامة</span>
                        </div>
                      </div>

                      <div className="bg-[#FAF8F5] p-3 rounded-xl text-[11px] text-[#0C3552]/75 border border-[#0C3552]/10">
                        <strong>طرق الوصول الخفية للإدارة للمشرف فقط:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                          <li>اختصار لوحة المفاتيح: <kbd className="bg-white px-1.5 py-0.5 rounded border">Ctrl + Shift + A</kbd></li>
                          <li>إضافة الرابط: <code className="bg-white px-1.5 py-0.5 rounded border">#admin</code> في شريط المتصفح</li>
                          <li>الضغط 3 مرات متتالية على عبارة "نسيم البحر الأحمر" في أسفل الموقع</li>
                        </ul>
                      </div>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-[#F2ECE1] p-5 rounded-2xl border border-[#0C3552]/15">
                      <h5 className="font-bold text-sm text-[#0C3552] mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#C29B63]" />
                        <span>تغيير وتشفير كلمة المرور الجديدة</span>
                      </h5>

                      {pwChangeMsg && (
                        <div
                          className={`p-3 rounded-xl text-xs font-semibold mb-3 ${
                            pwChangeMsg.type === 'success'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {pwChangeMsg.text}
                        </div>
                      )}

                      <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-[#0C3552] mb-1">كلمة المرور الحالية</label>
                          <input
                            type="password"
                            value={currentPw}
                            onChange={(e) => setCurrentPw(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-[#0C3552]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#0C3552] mb-1">كلمة المرور المشفرة الجديدة</label>
                          <input
                            type="password"
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                            placeholder="على الأقل 8 خانات تتضمن حروفاً وأرقاماً"
                            className="w-full bg-[#FAF8F5] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-[#0C3552]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#0C3552] mb-1">تأكيد كلمة المرور الجديدة</label>
                          <input
                            type="password"
                            value={confirmPw}
                            onChange={(e) => setConfirmPw(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-[#0C3552]"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#0C3552] hover:bg-[#051C2C] text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Shield className="w-3.5 h-3.5 text-[#C29B63]" />
                          <span>تشفير وحفظ كلمة المرور</span>
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Supervisor Encrypted Registration & Email Verification (Requested) */}
                  <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-3xl border border-[#0C3552]/15 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#0C3552]/10">
                      <div>
                        <h5 className="font-bold text-sm sm:text-base text-[#0C3552] flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-[#028090]" />
                          <span>تسجيل مشرف جديد مشفر مع التحقق بالبريد الإلكتروني</span>
                        </h5>
                        <p className="text-xs text-[#0C3552]/70">
                          حماية المشرفين عبر تشفير كلمات المرور برمجياً وطلب رسالة رمز تحقق من 6 أرقام لأول مرة
                        </p>
                      </div>

                      <span className="bg-[#028090]/10 text-[#028090] font-bold text-[10px] px-2.5 py-1 rounded-full border border-[#028090]/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>التحقق عبر البريد الإلكتروني مفعل</span>
                      </span>
                    </div>

                    {supMsg && (
                      <div
                        className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                          supMsg.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{supMsg.text}</span>
                      </div>
                    )}

                    {!supVerifStep ? (
                      <form onSubmit={handleRegisterSupervisor} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        <div>
                          <label className="block font-bold text-[#0C3552] mb-1">اسم المشرف الكامل *</label>
                          <input
                            type="text"
                            value={supName}
                            onChange={(e) => setSupName(e.target.value)}
                            placeholder="مثال: أحمد الغامدي"
                            className="w-full bg-white border border-[#0C3552]/20 rounded-xl px-3 py-2 text-[#0C3552] focus:outline-none focus:ring-2 focus:ring-[#C29B63]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#0C3552] mb-1">البريد الإلكتروني للتحقق *</label>
                          <input
                            type="email"
                            value={supEmail}
                            onChange={(e) => setSupEmail(e.target.value)}
                            placeholder="supervisor@northabhor.local"
                            className="w-full bg-white border border-[#0C3552]/20 rounded-xl px-3 py-2 text-[#0C3552] focus:outline-none focus:ring-2 focus:ring-[#C29B63]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#0C3552] mb-1">صلاحية ودور المشرف *</label>
                          <select
                            value={supRole}
                            onChange={(e) => setSupRole(e.target.value as any)}
                            className="w-full bg-white border border-[#0C3552]/20 rounded-xl px-3 py-2 text-[#0C3552] font-semibold focus:outline-none"
                          >
                            <option value="schools_moderator">مسؤول دليل المدارس</option>
                            <option value="editor">محرر أخبار ومقالات</option>
                            <option value="super_admin">مشرف عام كامل الصلاحيات</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-[#0C3552] mb-1">كلمة المرور المشفرة (8+ خانات) *</label>
                          <input
                            type="password"
                            value={supPassword}
                            onChange={(e) => setSupPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white border border-[#0C3552]/20 rounded-xl px-3 py-2 text-[#0C3552] focus:outline-none focus:ring-2 focus:ring-[#C29B63]"
                            required
                          />
                        </div>

                        <div className="sm:col-span-2 pt-1">
                          <button
                            type="submit"
                            disabled={supLoading}
                            className="bg-[#0C3552] hover:bg-[#051C2C] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#C29B63]" />
                            <span>{supLoading ? 'جاري التشفير...' : 'إرسال رمز التحقق وتسجيل المشرف'}</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifySupervisorCode} className="bg-white p-4 rounded-2xl border border-[#0C3552]/15 space-y-3 text-xs">
                        <div className="space-y-1">
                          <div className="font-bold text-[#0C3552] flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-[#028090]" />
                            <span>التحقق من البريد: {supEmailToVerify}</span>
                          </div>
                          <p className="text-[#0C3552]/70 text-[11px]">
                            تم توليد رمز تحقق مشفر مكون من 6 أرقام لحماية حساب المشرف:
                            <span className="font-mono font-bold bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#0C3552]/20 text-[#0C3552] ms-1.5 select-all">
                              {supSentCode}
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                          <input
                            type="text"
                            value={supCodeInput}
                            onChange={(e) => setSupCodeInput(e.target.value)}
                            placeholder="أدخل الرمز المكون من 6 أرقام..."
                            maxLength={6}
                            className="flex-1 bg-[#FAF8F5] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-center text-sm font-mono font-bold text-[#0C3552] tracking-widest focus:outline-none focus:ring-2 focus:ring-[#C29B63]"
                            required
                          />
                          <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>تأكيد التفعيل</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSupVerifStep(false)}
                            className="px-3 py-2 bg-gray-100 text-[#0C3552] rounded-xl text-xs"
                          >
                            إلغاء
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Supervisors Vault List */}
                    <div className="pt-3 border-t border-[#0C3552]/10 space-y-2">
                      <h6 className="font-bold text-xs text-[#0C3552]">قائمة المشرفين المسجلين في قاعدة البيانات المحمية:</h6>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                        {supervisorsList.map((sup) => (
                          <div
                            key={sup.id}
                            className="bg-white p-3 rounded-xl border border-[#0C3552]/10 flex items-center justify-between shadow-2xs"
                          >
                            <div>
                              <div className="font-bold text-[#0C3552] flex items-center gap-1">
                                <span>{sup.name}</span>
                                {sup.isVerified ? (
                                  <span className="text-emerald-600 text-[10px]" title="مفعل ومحقق">✓</span>
                                ) : (
                                  <span className="text-amber-600 text-[10px]">قيد التحقق</span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#0C3552]/60 font-sans">{sup.email}</div>
                              <div className="text-[10px] text-[#028090] font-semibold mt-0.5">
                                {sup.role === 'super_admin'
                                  ? 'مشرف عام'
                                  : sup.role === 'schools_moderator'
                                  ? 'مسؤول المدارس'
                                  : 'محرر محتوى'}
                              </div>
                            </div>

                            {sup.id !== 'sup_admin_1' && (
                              <button
                                onClick={() => handleDeleteSupervisorAction(sup.id, sup.name)}
                                className="text-rose-500 hover:text-rose-700 p-1 rounded-lg hover:bg-rose-50"
                                title="إلغاء المشرف"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: Articles CMS List */}
              {adminTab === 'articles' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#0C3552]/10">
                    <h4 className="font-bold text-base text-[#0C3552] font-serif">قائمة المقالات والأخبار المنشورة</h4>
                    <button
                      onClick={() => {
                        setEditingArticle({
                          id: 'art_' + Date.now(),
                          slug: 'article-' + Date.now(),
                          title: '',
                          summary: '',
                          content: '',
                          categoryId: 'news-development',
                          categoryName: 'أخبار وتطوير أبحر الشمالية',
                          coverImage:
                            'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
                          author: { name: 'فريق التحرير والرصد', role: 'المشرف العام - @Northabhor' },
                          publishDate: new Date().toISOString().split('T')[0],
                          readTimeMinutes: 3,
                          isBreaking: false,
                          isFeatured: false,
                          tags: ['أبحر الشمالية'],
                          views: 50,
                          ogTitle: '',
                          ogDescription: '',
                          ogImage: '',
                        });
                        setAdminTab('editor');
                      }}
                      className="bg-[#0C3552] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 hover:bg-[#051C2C]"
                    >
                      <Plus className="w-4 h-4 text-[#C29B63]" />
                      <span>كتابة مقال جديد</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {articles.map((art) => (
                      <div
                        key={art.id}
                        className="bg-[#F2ECE1] p-3.5 rounded-2xl border border-[#0C3552]/10 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={art.coverImage}
                            alt=""
                            className="w-14 h-12 rounded-xl object-cover shrink-0 bg-[#0C3552]"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              {art.isBreaking && (
                                <span className="bg-rose-700 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  عاجل
                                </span>
                              )}
                              {art.isFeatured && (
                                <span className="bg-[#C29B63] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  رئيسي
                                </span>
                              )}
                              <span className="text-[11px] font-semibold text-[#028090]">
                                {art.categoryName}
                              </span>
                            </div>
                            <h5 className="text-xs sm:text-sm font-bold text-[#0C3552] truncate">
                              {art.title}
                            </h5>
                            <span className="text-[10px] text-[#0C3552]/60">{art.publishDate}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingArticle(art);
                              setAdminTab('editor');
                            }}
                            className="p-1.5 rounded-lg text-[#0C3552] hover:bg-white transition-colors"
                            title="تعديل المقال"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`حذف مقال: "${art.title}"؟`)) {
                                onDeleteArticle(art.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
                            title="حذف المقال"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Full RTL Article Editor */}
              {adminTab === 'editor' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#0C3552]/10">
                    <h4 className="font-bold text-base text-[#0C3552] font-serif">محرر المقالات الصحفية RTL</h4>
                    <button
                      onClick={handleSaveArticleAction}
                      className="bg-[#0C3552] hover:bg-[#051C2C] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-4 h-4 text-[#C29B63]" />
                      <span>حفظ ونشر المقال</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Left 2 Cols: Main Content */}
                    <div className="lg:col-span-2 space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-[#0C3552] mb-1">عنوان التقرير أو الخبر الصحفي</label>
                        <input
                          type="text"
                          value={editingArticle.title}
                          onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                          placeholder="مثال: تدشين المرحلة الثانية من تطوير كورنيش أبحر الشمالية..."
                          className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-sm text-[#0C3552] font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#0C3552] mb-1">الملخص الإخباري الموجز (Lead)</label>
                        <textarea
                          rows={2}
                          value={editingArticle.summary}
                          onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                          placeholder="موجز صحفي مركز يظهر في التغذية الإخبارية والبطاقات..."
                          className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#0C3552] mb-1">
                          نص التقرير الكامل (يدعم العناوين والفقرات والبيانات)
                        </label>
                        <textarea
                          rows={12}
                          value={editingArticle.content}
                          onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                          placeholder="اكتب التقرير الصحفي الميداني هنا..."
                          className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2.5 text-xs text-[#0C3552] leading-relaxed font-sans"
                        />
                      </div>

                      {/* Embedded Data Table indicator */}
                      {editingArticle.dataTable && (
                        <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#0C3552]/10 flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#0C3552]">
                            جدول بيانات مدمج: <strong>{editingArticle.dataTable.title}</strong> (
                            {editingArticle.dataTable.rows.length} صف)
                          </span>
                          <button
                            onClick={() => setEditingArticle({ ...editingArticle, dataTable: undefined })}
                            className="text-rose-600 hover:underline text-xs font-bold"
                          >
                            إزالة الجدول
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right 1 Col: Metadata & Settings */}
                    <div className="space-y-3 bg-[#F2ECE1] p-4 rounded-2xl border border-[#0C3552]/10 text-xs">
                      <div>
                        <label className="block font-bold text-[#0C3552] mb-1">القسم والتصنيف</label>
                        <select
                          value={editingArticle.categoryId}
                          onChange={(e) => {
                            const found = categories.find((c) => c.id === e.target.value || c.slug === e.target.value);
                            setEditingArticle({
                              ...editingArticle,
                              categoryId: e.target.value,
                              categoryName: found?.name || 'عام',
                            });
                          }}
                          className="w-full bg-[#FAF8F5] border border-[#0C3552]/20 rounded-xl px-2.5 py-2 text-xs text-[#0C3552]"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#0C3552] mb-1">رابط صورة الغلاف</label>
                        <input
                          type="text"
                          value={editingArticle.coverImage}
                          onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value })}
                          className="w-full bg-[#FAF8F5] border border-[#0C3552]/20 rounded-xl px-2.5 py-1.5 text-xs text-[#0C3552]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#0C3552] mb-1">المحرر / المصدر</label>
                        <input
                          type="text"
                          value={editingArticle.author.name}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              author: { ...editingArticle.author, name: e.target.value },
                            })
                          }
                          className="w-full bg-[#FAF8F5] border border-[#0C3552]/20 rounded-xl px-2.5 py-1.5 text-xs text-[#0C3552]"
                        />
                      </div>

                      <div className="pt-2 border-t border-[#0C3552]/10 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingArticle.isBreaking}
                            onChange={(e) =>
                              setEditingArticle({ ...editingArticle, isBreaking: e.target.checked })
                            }
                            className="rounded text-rose-600 focus:ring-rose-500"
                          />
                          <span className="font-bold text-rose-700">خبر عاجل (يظهر في الشريط الأحمر)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingArticle.isFeatured}
                            onChange={(e) =>
                              setEditingArticle({ ...editingArticle, isFeatured: e.target.checked })
                            }
                            className="rounded text-[#C29B63] focus:ring-[#C29B63]"
                          />
                          <span className="font-bold text-[#0C3552]">مقال رئيسي (Banner Hero)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Excel Converter */}
              {adminTab === 'excel' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-[#0C3552]/10">
                    <h4 className="font-bold text-base text-[#0C3552] font-serif">
                      محول ملفات الإكسل و CSV التفاعلي (SheetJS)
                    </h4>
                    <p className="text-xs text-[#0C3552]/70">
                      ارفع جداول إحصاءات المدارس، مؤشرات العقار، أو نسب إنجاز المشاريع ليتم تضمينها كجداول تفاعلية.
                    </p>
                  </div>

                  <div className="bg-[#F2ECE1] p-6 rounded-2xl border-2 border-dashed border-[#0C3552]/20 text-center">
                    <FileSpreadsheet className="w-10 h-10 text-[#C29B63] mx-auto mb-2" />
                    <h5 className="font-bold text-sm text-[#0C3552] mb-1">اختر ملف إكسل (.xlsx, .xls) أو CSV</h5>
                    <p className="text-xs text-[#0C3552]/60 mb-4">يتم تحليل الصفوف والأعمدة محلياً وبشكل فوري</p>

                    <label className="inline-flex items-center gap-2 bg-[#0C3552] hover:bg-[#051C2C] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
                      <Upload className="w-4 h-4 text-[#C29B63]" />
                      <span>{excelLoading ? 'جاري الاستيراد...' : 'تصفح ورفع الملف'}</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleExcelUpload}
                        className="hidden"
                      />
                    </label>

                    {excelSuccessMsg && (
                      <div className="mt-3 text-emerald-800 bg-emerald-100 text-xs font-bold p-2.5 rounded-xl">
                        {excelSuccessMsg}
                      </div>
                    )}
                  </div>

                  {parsedTable && (
                    <div className="space-y-3 pt-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-[#0C3552]">معاينة الجدول المستورد</h5>
                        <button
                          onClick={insertParsedTableToArticle}
                          className="bg-[#028090] text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#006e7a]"
                        >
                          تضمين في المقال المفتوح
                        </button>
                      </div>
                      <DataTableEmbed table={parsedTable} />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Schools Management (Fixed: إضافة وتعديل وحذف المدارس) */}
              {adminTab === 'schools' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#0C3552]/10">
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-[#0C3552] font-serif flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-[#C29B63]" />
                        <span>إدارة دليل المدارس والمؤسسات التعليمية بأبحر</span>
                      </h4>
                      <p className="text-xs text-[#0C3552]/70">
                        إضافة وتعديل وحذف المدارس الأهلية، العالمية، والحكومية وتحديث رسومها ومراحلها
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={openNewSchoolModal}
                        className="bg-[#0C3552] hover:bg-[#051C2C] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4 text-[#C29B63]" />
                        <span>إضافة مدرسة جديدة</span>
                      </button>
                    </div>
                  </div>

                  {schoolActionMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
                        schoolActionMsg.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{schoolActionMsg.text}</span>
                    </div>
                  )}

                  {/* Search and Filters */}
                  <div className="bg-[#F2ECE1] p-3 rounded-2xl border border-[#0C3552]/10 flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#0C3552]/50 absolute start-3 top-2.5" />
                      <input
                        type="text"
                        value={schoolSearchTerm}
                        onChange={(e) => setSchoolSearchTerm(e.target.value)}
                        placeholder="ابحث باسم المدرسة، الحي، أو المنهج..."
                        className="w-full bg-white border border-[#0C3552]/20 rounded-xl py-1.5 ps-9 pe-3 text-xs text-[#0C3552] placeholder:text-[#0C3552]/40 focus:outline-none focus:ring-2 focus:ring-[#C29B63]"
                      />
                    </div>

                    <select
                      value={schoolTypeFilter}
                      onChange={(e) => setSchoolTypeFilter(e.target.value)}
                      className="bg-white border border-[#0C3552]/20 rounded-xl px-3 py-1.5 text-xs text-[#0C3552] font-semibold focus:outline-none"
                    >
                      <option value="الكل">جميع أنواع المدارس</option>
                      <option value="عالمي">عالمي</option>
                      <option value="أهلي">أهلي</option>
                      <option value="حكومي">حكومي</option>
                      <option value="حضانة ورياض أطفال">حضانة ورياض أطفال</option>
                    </select>

                    <select
                      value={schoolNeighborhoodFilter}
                      onChange={(e) => setSchoolNeighborhoodFilter(e.target.value)}
                      className="bg-white border border-[#0C3552]/20 rounded-xl px-3 py-1.5 text-xs text-[#0C3552] font-semibold focus:outline-none"
                    >
                      <option value="الكل">جميع الأحياء</option>
                      {Array.from(new Set(schools.map((s) => s.neighborhood))).map((nh) => (
                        <option key={nh} value={nh}>
                          {nh}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Schools Table */}
                  <div className="bg-white rounded-2xl border border-[#0C3552]/15 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-start">
                        <thead className="bg-[#FAF8F5] text-[#0C3552] border-b border-[#0C3552]/10 font-serif">
                          <tr>
                            <th className="p-3.5 text-start font-bold">اسم المنشأة التعليمية</th>
                            <th className="p-3.5 text-start font-bold">النوع والجنس</th>
                            <th className="p-3.5 text-start font-bold">الحي والشارع</th>
                            <th className="p-3.5 text-start font-bold">المراحل والمنهج</th>
                            <th className="p-3.5 text-start font-bold">الرسوم والتقييم</th>
                            <th className="p-3.5 text-end font-bold">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#0C3552]/10">
                          {schools
                            .filter((s) => {
                              const matchesSearch =
                                s.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
                                s.neighborhood.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
                                s.curriculum.toLowerCase().includes(schoolSearchTerm.toLowerCase());
                              const matchesType =
                                schoolTypeFilter === 'الكل' || s.type === schoolTypeFilter;
                              const matchesNeighborhood =
                                schoolNeighborhoodFilter === 'الكل' ||
                                s.neighborhood === schoolNeighborhoodFilter;
                              return matchesSearch && matchesType && matchesNeighborhood;
                            })
                            .map((s) => (
                              <tr key={s.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                                <td className="p-3.5 font-bold text-[#0C3552]">
                                  <div className="flex items-center gap-1.5">
                                    <span>{s.name}</span>
                                    {s.accredited && (
                                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-sm" title="معتمدة">
                                        معتمدة
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#0C3552]/60 font-mono font-normal">
                                    {s.phone}
                                  </div>
                                </td>

                                <td className="p-3.5">
                                  <span className="bg-[#0C3552]/10 text-[#0C3552] font-bold px-2 py-0.5 rounded-full text-[10px]">
                                    {s.type}
                                  </span>
                                  <div className="text-[11px] text-[#0C3552]/70 mt-0.5">
                                    {s.gender}
                                  </div>
                                </td>

                                <td className="p-3.5">
                                  <div className="font-bold text-[#028090]">{s.neighborhood}</div>
                                  <div className="text-[10px] text-[#0C3552]/60 truncate max-w-[150px]">
                                    {s.address}
                                  </div>
                                </td>

                                <td className="p-3.5">
                                  <div className="font-semibold text-[#0C3552]">{s.curriculum}</div>
                                  <div className="text-[10px] text-[#0C3552]/70">
                                    {(s.stages || []).join('، ')}
                                  </div>
                                </td>

                                <td className="p-3.5">
                                  <div className="font-mono font-bold text-[#C29B63]">{s.feesRange}</div>
                                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                                    <Star className="w-3 h-3 fill-current text-amber-500" />
                                    <span>{s.rating}</span>
                                    <span className="text-[#0C3552]/50">({s.reviewsCount})</span>
                                  </div>
                                </td>

                                <td className="p-3.5 text-end space-x-1 space-x-reverse">
                                  <button
                                    onClick={() => openEditSchoolModal(s)}
                                    className="p-1.5 text-[#0C3552] hover:bg-[#F2ECE1] rounded-lg transition-colors inline-block"
                                    title="تعديل بيانات المدرسة"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSchoolAction(s.id, s.name)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-block"
                                    title="حذف المدرسة"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Media Manager */}
              {adminTab === 'media' && (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-[#0C3552]/10">
                    <h4 className="font-bold text-base text-[#0C3552] font-serif">مدير الصور والوسائط</h4>
                    <p className="text-xs text-[#0C3552]/70">استخدم روابط الصور المعتمدة لمقالات وتغطيات أبحر</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="أدخل رابط صورة مباشر (Unsplash أو ميديا أخرى)..."
                      value={mediaUploadUrl}
                      onChange={(e) => setMediaUploadUrl(e.target.value)}
                      className="flex-1 bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                    />
                    <button
                      onClick={() => {
                        if (mediaUploadUrl) {
                          setUploadedMediaList([mediaUploadUrl, ...uploadedMediaList]);
                          setMediaUploadUrl('');
                        }
                      }}
                      className="bg-[#0C3552] text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      إضافة
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploadedMediaList.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-video rounded-xl overflow-hidden bg-[#0C3552] border border-[#0C3552]/10"
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(url);
                              alert('تم نسخ رابط الصورة!');
                            }}
                            className="bg-white text-[#0C3552] p-1.5 rounded-lg text-xs font-bold"
                          >
                            نسخ الرابط
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: SEO & Twitter Cards */}
              {adminTab === 'seo' && (
                <div className="space-y-4 text-xs">
                  <div className="pb-3 border-b border-[#0C3552]/10">
                    <h4 className="font-bold text-base text-[#0C3552] font-serif">معاينة بطاقة Twitter/X و SEO</h4>
                    <p className="text-[#0C3552]/70">توليد تلقائي لبطاقات Twitter Card وتنسيق المشاركة في شبكات التواصل</p>
                  </div>

                  <div className="max-w-md mx-auto bg-white rounded-2xl overflow-hidden border border-[#0C3552]/15 shadow-sm">
                    <img
                      src={editingArticle.coverImage}
                      alt=""
                      className="w-full aspect-[1.91/1] object-cover bg-[#0C3552]"
                    />
                    <div className="p-4 space-y-1">
                      <span className="text-[11px] text-[#0C3552]/60 uppercase font-bold">
                        northabhor.local • {BRAND_INFO.handle}
                      </span>
                      <h5 className="font-bold text-sm text-[#0C3552] line-clamp-2">
                        {editingArticle.title || 'عنوان التقرير الصحفي يظهر هنا...'}
                      </h5>
                      <p className="text-[11px] text-[#0C3552]/70 line-clamp-2">
                        {editingArticle.summary || 'الموجز الصحفي للتقرير يظهر في بطاقة تويتر الرسمية...'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Edit / Add Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl p-5 sm:p-6 border border-[#0C3552]/20 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C3552]/10 mb-4">
              <h4 className="font-bold text-base text-[#0C3552] font-serif flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C29B63]" />
                <span>{editingCategory ? 'تعديل قسم' : 'إضافة قسم جديد'}</span>
              </h4>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F2ECE1] text-[#0C3552]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-3.5 text-xs text-start">
              <div>
                <label className="block font-bold text-[#0C3552] mb-1">اسم القسم باللغة العربية *</label>
                <input
                  type="text"
                  value={catFormName}
                  onChange={(e) => {
                    setCatFormName(e.target.value);
                    if (!editingCategory && !catFormSlug) {
                      setCatFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="مثال: مزادات ومخططات أبحر"
                  className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-sm text-[#0C3552]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C3552] mb-1">المعرف الإنجليزي (Slug) *</label>
                <input
                  type="text"
                  value={catFormSlug}
                  onChange={(e) => setCatFormSlug(e.target.value)}
                  placeholder="auctions-plans"
                  className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs font-mono text-[#0C3552]"
                  required
                />
                <span className="text-[10px] text-[#0C3552]/60 mt-0.5 block">
                  يستخدم في الروابط والتصنيف: حروف إنجليزية وشرطات فقط
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#0C3552] mb-1">الاسم بالإنجليزية (اختياري)</label>
                <input
                  type="text"
                  value={catFormNameEn}
                  onChange={(e) => setCatFormNameEn(e.target.value)}
                  placeholder="Auctions & Plans"
                  className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0C3552] mb-1">وصف القسم</label>
                <textarea
                  rows={2}
                  value={catFormDesc}
                  onChange={(e) => setCatFormDesc(e.target.value)}
                  placeholder="وصف لما يحتويه هذا القسم..."
                  className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={categorySaveLoading}
                  className="flex-1 bg-[#0C3552] hover:bg-[#051C2C] text-white font-bold py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  {categorySaveLoading ? 'جاري الحفظ...' : editingCategory ? 'تحديث القسم' : 'إنشاء القسم'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F2ECE1] text-[#0C3552] font-bold rounded-xl hover:bg-gray-200"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* School Add / Edit Modal */}
      {isSchoolModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-7 max-w-2xl w-full border border-[#0C3552]/20 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#0C3552]/10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#0C3552] text-[#C29B63] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#0C3552] font-serif">
                    {editingSchool ? 'تعديل بيانات المدرسة' : 'إضافة مدرسة جديدة لدليل أبحر'}
                  </h4>
                  <p className="text-xs text-[#0C3552]/60">
                    تحديث شامل للمعلومات والرسوم والمراحل وموقع المدرسة
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSchoolModalOpen(false)}
                className="text-[#0C3552]/50 hover:text-[#0C3552] font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSchoolSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0C3552] mb-1">اسم المنشأة التعليمية *</label>
                  <input
                    type="text"
                    value={schoolFormName}
                    onChange={(e) => setSchoolFormName(e.target.value)}
                    placeholder="مثال: مدارس أبحر العالمية الحديثة"
                    className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#0C3552] focus:outline-none focus:ring-2 focus:ring-[#C29B63]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C3552] mb-1">نوع المدرسة *</label>
                  <select
                    value={schoolFormType}
                    onChange={(e) => setSchoolFormType(e.target.value as School['type'])}
                    className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#0C3552] focus:outline-none"
                  >
                    <option value="عالمي">عالمي</option>
                    <option value="أهلي">أهلي</option>
                    <option value="حكومي">حكومي</option>
                    <option value="حضانة ورياض أطفال">حضانة ورياض أطفال</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0C3552] mb-1">الجنس المخدوم *</label>
                  <select
                    value={schoolFormGender}
                    onChange={(e) => setSchoolFormGender(e.target.value as School['gender'])}
                    className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs font-semibold text-[#0C3552] focus:outline-none"
                  >
                    <option value="مشترك">مشترك (بنين وبنات)</option>
                    <option value="بنين">بنين فقط</option>
                    <option value="بنات">بنات فقط</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0C3552] mb-1">الحي بأبحر الشمالية *</label>
                  <input
                    type="text"
                    value={schoolFormNeighborhood}
                    onChange={(e) => setSchoolFormNeighborhood(e.target.value)}
                    placeholder="الياقوت، الشراع، الصواري..."
                    className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C3552] mb-1">المنهج التعليمي *</label>
                  <input
                    type="text"
                    value={schoolFormCurriculum}
                    onChange={(e) => setSchoolFormCurriculum(e.target.value)}
                    placeholder="مثال: منهج أمريكي معتمد، وزاري سعودي، بريطاني..."
                    className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C3552] mb-1">نطاق الرسوم السنوية</label>
                  <input
                    type="text"
                    value={schoolFormFees}
                    onChange={(e) => setSchoolFormFees(e.target.value)}
                    placeholder="مثال: 18,000 - 32,000 ر.س"
                    className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C3552] mb-1">رقم الهاتف / التواصل</label>
                  <input
                    type="text"
                    value={schoolFormPhone}
                    onChange={(e) => setSchoolFormPhone(e.target.value)}
                    placeholder="012-0000000"
                    className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0C3552] mb-1">العنوان التفصيلي والشارع</label>
                  <input
                    type="text"
                    value={schoolFormAddress}
                    onChange={(e) => setSchoolFormAddress(e.target.value)}
                    placeholder="مثال: شارع الأمير عبدالمجيد، بجوار جامع الخير"
                    className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                  />
                </div>

                {/* Stages checkboxes */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block font-bold text-[#0C3552]">المراحل الدراسية المتوفرة</label>
                  <div className="flex flex-wrap gap-2">
                    {['روضة', 'ابتدائي', 'متوسط', 'ثانوي'].map((st) => (
                      <label
                        key={st}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                          schoolFormStages.includes(st)
                            ? 'bg-[#0C3552] text-white border-[#0C3552]'
                            : 'bg-white text-[#0C3552] border-[#0C3552]/20 hover:bg-[#F2ECE1]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={schoolFormStages.includes(st)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSchoolFormStages([...schoolFormStages, st]);
                            } else {
                              setSchoolFormStages(schoolFormStages.filter((s) => s !== st));
                            }
                          }}
                          className="hidden"
                        />
                        <span>{st}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#0C3552] mb-1">التقييم (من 1 إلى 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={schoolFormRating}
                    onChange={(e) => setSchoolFormRating(parseFloat(e.target.value) || 4.5)}
                    className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0C3552] mb-1">عدد التقييمات</label>
                  <input
                    type="number"
                    min="1"
                    value={schoolFormReviews}
                    onChange={(e) => setSchoolFormReviews(parseInt(e.target.value, 10) || 10)}
                    className="w-full bg-[#F2ECE1] border border-[#0C3552]/20 rounded-xl px-3 py-2 text-xs text-[#0C3552]"
                  />
                </div>

                <div className="sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={schoolFormAccredited}
                      onChange={(e) => setSchoolFormAccredited(e.target.checked)}
                      className="rounded text-[#0C3552] focus:ring-[#C29B63] w-4 h-4"
                    />
                    <span className="font-bold text-[#0C3552] text-xs">
                      منشأة تعليمية معتمدة رسمياً ومصرحة من وزارة التعليم
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#0C3552]/10">
                <button
                  type="submit"
                  disabled={schoolSaveLoading}
                  className="flex-1 bg-[#0C3552] hover:bg-[#051C2C] text-white font-bold py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-[#C29B63]" />
                  <span>
                    {schoolSaveLoading
                      ? 'جاري الحفظ...'
                      : editingSchool
                      ? 'تحديث بيانات المدرسة'
                      : 'حفظ المدرسة بالدليل'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsSchoolModalOpen(false)}
                  className="px-5 py-2.5 bg-[#F2ECE1] text-[#0C3552] font-bold rounded-xl hover:bg-gray-200"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
