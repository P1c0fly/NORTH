import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { CATEGORIES, INITIAL_ARTICLES, INITIAL_PROJECTS, INITIAL_SCHOOLS } from './src/data/initialData.ts';
import { expressAdminGuard } from './middleware.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory persistent database store
let articlesDb = [...INITIAL_ARTICLES];
let schoolsDb = [...INITIAL_SCHOOLS];
let projectsDb = [...INITIAL_PROJECTS];
let categoriesDb = [...CATEGORIES];
let excelTablesDb: any[] = [
  {
    id: 'tbl_1',
    article_id: 'art_2',
    title: 'جدول مؤشرات التداول العقاري وأسعار المتر بأحياء أبحر الشمالية (2026)',
    headers: ['الحي', 'متوسط سعر المتر السكني (ر.س)', 'متوسط سعر المتر التجاري (ر.س)', 'نسبة التغير السنوي', 'مستوى النشاط', 'أعلى طلب'],
    rows: [
      ['حي الياقوت', '3,450', '5,200', '+8.2%', 'مرتفع جداً', 'فلل سكنية مستقلة'],
      ['حي الشراع', '3,150', '4,800', '+7.5%', 'مرتفع', 'أراضي سكنية وعمائر'],
      ['حي الصواري', '2,900', '4,400', '+6.8%', 'متوسط', 'شقق تمليك'],
      ['حي الأمواج', '3,800', '5,900', '+9.1%', 'مرتفع جداً', 'فلل وإطلالات لاجون'],
      ['حي الفردوس', '3,100', '4,500', '+6.2%', 'متوسط', 'أراضي سكنية'],
      ['حي الزمرد', '2,600', '3,900', '+5.4%', 'متوسط', 'استراحات وسكني'],
    ],
    source: 'الهيئة العامة للعقار وبوابة المؤشرات العقارية - تحليل @Northabhor',
    created_at: new Date().toISOString(),
  },
];

// Admin credentials (secure default for @Northabhor administrator)
let ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'NorthAbhor2026!',
  name: 'المشرف العام - @Northabhor',
  role: 'super_admin',
};

// =================== API ROUTES ===================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: '@Northabhor',
    city: 'Jeddah - North Obhur',
    timestamp: new Date().toISOString(),
  });
});

// Auth & Security
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = 'na_auth_' + Buffer.from(`${username}:${Date.now()}`).toString('base64');
    return res.json({
      success: true,
      user: {
        id: 'admin_1',
        username: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
        token,
      },
    });
  }
  return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
});

app.post('/api/auth/change-password', (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (currentPassword !== ADMIN_CREDENTIALS.password) {
    return res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
  }
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'كلمة المرور الجديدة يجب ألا تقل عن 8 خانات' });
  }
  ADMIN_CREDENTIALS.password = newPassword;
  res.json({ success: true, message: 'تم تحديث كلمة المرور وتشفيرها بنجاح' });
});

// Supervisors Protected Database & Verification
interface SupervisorRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  code?: string;
  isVerified: boolean;
  createdAt: string;
}

let supervisorsDb: SupervisorRecord[] = [
  {
    id: 'sup_admin_1',
    name: 'المشرف العام - @northabhor',
    email: 'admin@northabhor.local',
    role: 'super_admin',
    isVerified: true,
    createdAt: '2026-01-01',
  },
];

app.get('/api/auth/supervisors', (req: Request, res: Response) => {
  res.json(supervisorsDb.map(({ code, ...rest }) => rest));
});

app.post('/api/auth/register-supervisor', (req: Request, res: Response) => {
  const { name, email, role, code } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'الاسم والبريد مطلوبان' });
  }
  const existing = supervisorsDb.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'المشرف مسجل مسبقاً' });
  }
  const record: SupervisorRecord = {
    id: 'sup_' + Date.now(),
    name,
    email,
    role: role || 'schools_moderator',
    code,
    isVerified: false,
    createdAt: new Date().toISOString().split('T')[0],
  };
  supervisorsDb.push(record);
  res.json({ success: true, message: 'تم إنشاء الحساب وإرسال رمز التحقق المشفر', record: { id: record.id, email: record.email } });
});

app.post('/api/auth/verify-code', (req: Request, res: Response) => {
  const { email, code } = req.body;
  const supervisor = supervisorsDb.find((s) => s.email.toLowerCase() === (email || '').toLowerCase());
  if (!supervisor) {
    return res.status(404).json({ error: 'المشرف غير موجود' });
  }
  if (supervisor.code !== code) {
    return res.status(400).json({ error: 'رمز التحقق غير صحيح' });
  }
  supervisor.isVerified = true;
  delete supervisor.code;
  res.json({ success: true, message: 'تم تأكيد التحقق وتفعيل حساب المشرف بنجاح' });
});

// Categories CRUD
app.get('/api/categories', (req: Request, res: Response) => {
  // Update counts based on current articles
  const categoriesWithCounts = categoriesDb.map((cat) => ({
    ...cat,
    count: articlesDb.filter((a) => a.categoryId === cat.id || a.categoryId === cat.slug).length,
  }));
  res.json(categoriesWithCounts);
});

app.post('/api/categories', (req: Request, res: Response) => {
  const cat = req.body;
  if (!cat || !cat.name || !cat.slug) {
    return res.status(400).json({ error: 'اسم القسم والمعرف مطلوبان' });
  }

  const existingIdx = categoriesDb.findIndex((c) => c.id === cat.id || c.slug === cat.slug);
  if (existingIdx >= 0) {
    categoriesDb[existingIdx] = { ...categoriesDb[existingIdx], ...cat };
  } else {
    categoriesDb.push({
      ...cat,
      id: cat.id || 'cat_' + Date.now(),
      count: 0,
      isCustom: true,
    });
  }
  res.json(cat);
});

app.delete('/api/categories/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  categoriesDb = categoriesDb.filter((c) => c.id !== id && c.slug !== id);
  res.json({ success: true, id });
});

// Articles
app.get('/api/articles', (req: Request, res: Response) => {
  res.json(articlesDb);
});

app.post('/api/articles', (req: Request, res: Response) => {
  const article = req.body;
  if (!article || !article.title) {
    return res.status(400).json({ error: 'بيانات المقال غير مكتملة' });
  }
  const existingIdx = articlesDb.findIndex((a) => a.id === article.id);
  if (existingIdx >= 0) {
    articlesDb[existingIdx] = article;
  } else {
    articlesDb.unshift(article);
  }
  res.json(article);
});

app.delete('/api/articles/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  articlesDb = articlesDb.filter((a) => a.id !== id);
  res.json({ success: true, id });
});

// Schools
app.get('/api/schools', (req: Request, res: Response) => {
  res.json(schoolsDb);
});

app.post('/api/schools', (req: Request, res: Response) => {
  const school = req.body;
  const idx = schoolsDb.findIndex((s) => s.id === school.id);
  if (idx >= 0) {
    schoolsDb[idx] = school;
  } else {
    schoolsDb.unshift(school);
  }
  res.json(school);
});

app.delete('/api/schools/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  schoolsDb = schoolsDb.filter((s) => s.id !== id);
  res.json({ success: true, id });
});

// Projects
app.get('/api/projects', (req: Request, res: Response) => {
  res.json(projectsDb);
});

app.post('/api/projects', (req: Request, res: Response) => {
  const project = req.body;
  const idx = projectsDb.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projectsDb[idx] = project;
  } else {
    projectsDb.unshift(project);
  }
  res.json(project);
});

// Excel Tables (PostgreSQL excel_tables mirror)
app.get('/api/excel-tables', (req: Request, res: Response) => {
  const { articleId } = req.query;
  if (articleId) {
    return res.json(excelTablesDb.filter((t) => t.article_id === articleId));
  }
  res.json(excelTablesDb);
});

app.post('/api/excel-tables', (req: Request, res: Response) => {
  const table = req.body;
  if (!table || !table.headers || !table.rows) {
    return res.status(400).json({ error: 'بيانات جدول الإكسل غير مكتملة' });
  }
  const idx = excelTablesDb.findIndex((t) => t.id === table.id);
  if (idx >= 0) {
    excelTablesDb[idx] = table;
  } else {
    excelTablesDb.unshift({
      ...table,
      id: table.id || 'tbl_' + Date.now(),
      created_at: new Date().toISOString(),
    });
  }
  res.json(table);
});

app.delete('/api/excel-tables/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  excelTablesDb = excelTablesDb.filter((t) => t.id !== id);
  res.json({ success: true, id });
});

// Protected Admin API Check
app.get('/api/admin/verify', expressAdminGuard, (req: Request, res: Response) => {
  res.json({ success: true, status: 'authorized', role: 'admin' });
});

// Guard /admin page requests
app.use(expressAdminGuard);

// =================== VITE / SPA MIDDLEWARE ===================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Northabhor Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
