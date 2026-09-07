import { Article, Category, CommunityMetric, Project, RealEstateIndex, School } from '../types';

export const BRAND_INFO = {
  handle: '@Northabhor',
  name: 'أبحر الشمالية | اسأل أبحر',
  title: 'المنصة الإخبارية والرقمية الرائدة لأبحر الشمالية بجدة',
  tagline: 'دليلك الذكي لكل ما يخص أبحر - أخبار الحي، متابعة المشاريع، ودليل الخدمات والمدارس',
  twitterUrl: 'https://x.com/Northabhor',
  linkflyUrl: 'https://linkfly.to/60512dkhz5h',
  location: 'جدة، المملكة العربية السعودية - أبحر الشمالية',
  editorBio: 'لنقل أخبار الحي ومتابعة مشاريعه واستقبال أسئلتكم واستفساراتكم ونشر ملاحظاتكم وتطلعاتكم',
};

export const CATEGORIES: Category[] = [
  {
    id: 'news-development',
    name: 'أخبار وتطوير أبحر الشمالية',
    nameEn: 'North Obhur News & Development',
    slug: 'news-development',
    description: 'تغطية يومية موثوقة لأهم المستجدات، القرارات البلدية، ومشاريع الحي',
    count: 14,
  },
  {
    id: 'schools-directory',
    name: 'دليل المدارس والمؤسسات التعليمية',
    nameEn: 'Schools & Educational Directory',
    slug: 'schools-directory',
    description: 'قاعدة بيانات متكاملة لمدارس البنين والبنات والأكاديميات العالمية بالأحياء',
    count: 10,
  },
  {
    id: 'projects-services',
    name: 'المشاريع والخدمات',
    nameEn: 'Projects & Infrastructure',
    slug: 'projects-services',
    description: 'متابعة ميدانية حية لنسب إنجاز الجسور، الواجهات، وتطوير المخططات',
    count: 8,
  },
  {
    id: 'public-data',
    name: 'البيانات والتقارير العامة',
    nameEn: 'Public Data & Analytics',
    slug: 'public-data',
    description: 'مؤشرات أسعار العقار، إحصاءات الكثافة، وتحليلات التنمية السكنية',
    count: 6,
  },
  {
    id: 'analysis-guides',
    name: 'المقالات والتحليلات',
    nameEn: 'Analytical Articles & Guides',
    slug: 'analysis-guides',
    description: 'مقالات رأي وأدلة سكنية واستثمارية حصرية موجهة لسكان ومستثمري أبحر',
    count: 9,
  },
];

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'sch_1',
    name: 'مدارس دار جنى العالمية (فرع أبحر)',
    type: 'عالمي',
    gender: 'مشترك',
    stages: ['رياض أطفال', 'ابتدائي', 'متوسط', 'ثانوي'],
    neighborhood: 'حي الشاطئ / أبحر',
    curriculum: 'أمريكي (American Diploma) + معتمد Cognia',
    rating: 4.8,
    reviewsCount: 142,
    feesRange: '32,000 - 48,000 ريال/سنوياً',
    phone: '0122348890',
    address: 'شارع الأمير عبدالمجيد، أبحر الشمالية',
    accredited: true,
  },
  {
    id: 'sch_2',
    name: 'مدارس الواحة العالمية',
    type: 'عالمي',
    gender: 'مشترك',
    stages: ['رياض أطفال', 'ابتدائي', 'متوسط', 'ثانوي'],
    neighborhood: 'حي الياقوت',
    curriculum: 'بريطاني (Cambridge IGCSE)',
    rating: 4.6,
    reviewsCount: 98,
    feesRange: '28,000 - 42,000 ريال/سنوياً',
    phone: '0126541122',
    address: 'شارع عابر القارات، حي الياقوت',
    accredited: true,
  },
  {
    id: 'sch_3',
    name: 'مدارس الفردوس النموذجية الأهلية',
    type: 'أهلي',
    gender: 'مشترك',
    stages: ['ابتدائي', 'متوسط', 'ثانوي'],
    neighborhood: 'حي الفردوس',
    curriculum: 'منهج وطني سعودي معزز باللغة الإنجليزية والحاسب',
    rating: 4.7,
    reviewsCount: 115,
    feesRange: '18,000 - 26,000 ريال/سنوياً',
    phone: '0122894560',
    address: 'شارع السلام، حي الفردوس',
    accredited: true,
  },
  {
    id: 'sch_4',
    name: 'مدارس منارات جدة - مجمع أبحر الشمالية',
    type: 'أهلي',
    gender: 'مشترك',
    stages: ['رياض أطفال', 'ابتدائي', 'متوسط'],
    neighborhood: 'حي الشراع',
    curriculum: 'مسار أهلي ودولي معتمد',
    rating: 4.9,
    reviewsCount: 160,
    feesRange: '24,000 - 36,000 ريال/سنوياً',
    phone: '0126993411',
    address: 'مخطط الشراع، بالقرب من طريق الأمير نايف',
    accredited: true,
  },
  {
    id: 'sch_5',
    name: 'أكاديمية وعد للتعليم المتقدم',
    type: 'عالمي',
    gender: 'مشترك',
    stages: ['ابتدائي', 'متوسط', 'ثانوي'],
    neighborhood: 'طريق عسفان / أبحر',
    curriculum: 'دولي ثنائي اللغة (IB World School Candidate)',
    rating: 4.9,
    reviewsCount: 210,
    feesRange: '45,000 - 68,000 ريال/سنوياً',
    phone: '0122158888',
    address: 'طريق عسفان المتصل بشمال أبحر',
    accredited: true,
  },
  {
    id: 'sch_6',
    name: 'مدرسة الياقوت الابتدائية الأولى للبنات',
    type: 'حكومي',
    gender: 'بنات',
    stages: ['ابتدائي'],
    neighborhood: 'حي الياقوت',
    curriculum: 'وزارة التعليم السعودية',
    rating: 4.5,
    reviewsCount: 76,
    feesRange: 'مجاني (حكومي)',
    phone: '0122390111',
    address: 'شارع الإمام مسلم، حي الياقوت',
    accredited: true,
  },
  {
    id: 'sch_7',
    name: 'مدرسة الأمير سلطان المتوسطة للبنين',
    type: 'حكومي',
    gender: 'بنين',
    stages: ['متوسط'],
    neighborhood: 'حي الصواري',
    curriculum: 'وزارة التعليم السعودية',
    rating: 4.4,
    reviewsCount: 65,
    feesRange: 'مجاني (حكومي)',
    phone: '0122390222',
    address: 'طريق الملك فيصل، حي الصواري',
    accredited: true,
  },
  {
    id: 'sch_8',
    name: 'حضانة وروضة أجيال أبحر الدولية',
    type: 'حضانة ورياض أطفال',
    gender: 'مشترك',
    stages: ['رياض أطفال'],
    neighborhood: 'حي الأمواج',
    curriculum: 'منتسوري + لغات تفاعلية',
    rating: 4.9,
    reviewsCount: 88,
    feesRange: '15,000 - 22,000 ريال/سنوياً',
    phone: '0122881290',
    address: 'حي الأمواج، مجاور للممشى البحري',
    accredited: true,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_1',
    title: 'جسر أبحر المعلق (أيقونة الربط البحري)',
    category: 'نقل وجسور',
    neighborhood: 'خور أبحر (الربط بين أبحر الجنوبية والشمالية)',
    status: 'قيد التنفيذ',
    progressPercentage: 82,
    budget: '2.4 مليار ريال سعودي',
    completionDate: 'الربع الرابع 2026',
    description: 'أحد أهم مشاريع النقل الاستراتيجية بجدة، يربط شمال وجنوب شرم أبحر بطول 350 متراً وعرض 74 متراً، مع مسار مخصص للترام و8 مسارات للمركبات، مما يختصر وقت التنقل بنسبة 70%.',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
    contractorOrOwner: 'أمانة محافظة جدة وشركة مترو جدة',
    keyHighlights: [
      '8 مسارات للمركبات في الاتجاهين',
      'مسار مستقل للترام الكهربائي والمشاة',
      'يقلص زمن الوصول لمطار الملك عبدالعزيز إلى 12 دقيقة',
      'ارتفاع ملاحي يسمح بمرور السفن واليخوت السياحية الكبرى',
    ],
  },
  {
    id: 'proj_2',
    title: 'استكمال برج جدة ومدينة المملكة شمال أبحر',
    category: 'أبراج وعقارات',
    neighborhood: 'شمال أبحر - خليج سلمان',
    status: 'قيد التنفيذ',
    progressPercentage: 68,
    budget: 'أكثر من 7.5 مليار ريال',
    completionDate: '2028',
    description: 'استئناف الأعمال الإنشائية في البرج الأطول عالمياً بارتفاع يتجاوز 1000 متر، مع تطوير البنية التحتية المتكاملة لمدينة المملكة الممتدة على مساحة 5.3 مليون متر مربع.',
    image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&w=1200&q=80',
    contractorOrOwner: 'شركة جدة الاقتصادية (JEC) ومجموعة بن لادن',
    keyHighlights: [
      'البرج الأطول في العالم بارتفاع 1,000+ متر',
      'مركز أعمال ومالي عالمي وفنادق 7 نجوم',
      'مارينا متكاملة وواجهة بحرية خاصة',
    ],
  },
  {
    id: 'proj_3',
    title: 'تطوير واجهة وممشى أبحر الشمالية الساحلي',
    category: 'واجهات بحرية وتطوير',
    neighborhood: 'أبحر الشمالية - شاطئ الإسكندرية والأمواج',
    status: 'مكتمل',
    progressPercentage: 100,
    budget: '320 مليون ريال',
    completionDate: 'تم التدشين',
    description: 'واجهة بحرية متطورة وممشى عصري بطول 4.5 كم يضم مسارات للدراجات، مسطحات خضراء، مناطق ألعاب أطفال، جلسات عائلية مظللة، ونقاط مطاعم ومقاهٍ سياحية راقية.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    contractorOrOwner: 'أمانة محافظة جدة',
    keyHighlights: [
      'ممشى رياضي بطول 4,500 متر',
      '14 منطقة ألعاب أطفال تفاعلية',
      'شاطئ رملي سباحي مهيأ بالكامل',
      'محطات شحن للمركبات الكهربائية ومواقف مظللة',
    ],
  },
  {
    id: 'proj_4',
    title: 'مشروع توسعة وتطوير طريق عابر القارات المحوري',
    category: 'بنية تحتية',
    neighborhood: 'أحياء الشراع، الياقوت، والصواري',
    status: 'قيد التنفيذ',
    progressPercentage: 75,
    budget: '180 مليون ريال',
    completionDate: 'الربع الثالث 2026',
    description: 'توسعة وتطوير شريان المرور الرئيسي في أبحر الشمالية ليتسع لـ 4 مسارات في كل اتجاه مع إنارة ذكية وشبكة تصريف لمياه الأمطار وتنسيق أرصفة المشاة.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
    contractorOrOwner: 'وزارة النقل والخدمات اللوجستية',
    keyHighlights: [
      'ربط مباشر بين طريق المدينة وطريق الملك عبدالعزيز',
      'أحدث أنظمة تصريف السيول تحت الأرض',
      'إشارات ذكية تعمل بالذكاء الاصطناعي لإدارة التدفق',
    ],
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art_1',
    slug: 'obhur-suspension-bridge-82-percent',
    title: 'جسر أبحر المعلق يكسر حاجز 82% إنجازاً: بدء شد الكوابل الفولاذية والافتتاح التجريبي في الأفق',
    summary: 'رصد ميداني خاص بـ @Northabhor يرصد تسارع وتيرة الأعمال الإنشائية في جسر أبحر المعلق وتركيب الأعمدة الحاملة للترام تمهيداً للافتتاح التجريبي.',
    content: `تشهد منطقة شرم أبحر تسارعاً هندسياً لافتاً في وتيرة تنفيذ **جسر أبحر المعلق**، أحد أضخم المشاريع الإنشائية للنقل في محافظة جدة ومستهدفات جودة الحياة لرؤية 2030.

وحسب مصادر المتابعة الميدانية لـ **@Northabhor**، بلغت نسبة الإنجاز الإجمالية في المشروع ما يقارب **82%**، مع الانتهاء من صب كافة القواعد العميقة تحت سطح المياه وتثبيت الركائز الخرسانية العملاقة.

### أبرز المكتسبات الفنية للمشروع:
- **الربط الاستراتيجي:** اختصار المسافة بين أبحر الشمالية وأبحر الجنوبية من 35 دقيقة عبر طريق المدينة إلى أقل من **4 دقائق** فقط.
- **مسار الترام المزدوج:** تم الانتهاء من تجهيز المسار الأوسط المخصص لقطار الترام الكهربائي لربط الأحياء الشمالية بشبكة محطات قطار الحرمين ومطار الملك عبدالعزيز.
- **الجانب السياحي:** تم تصميم الجسر بقوس معماري مائل يرتفع 65 متراً فوق مياه الخور، متيحاً عبور السفن السياحية واليخوت بدون أي عوائق ملاحية.

وأكد مختصون في التخطيط الحضري لـ **@Northabhor** أن تشغيل الجسر سيحدث نقلة نوعية في أسعار العقارات بأحياء الياقوت والشراع والصواري والزمرد، نظراً لتحولها إلى الواجهة السكنية الأولى المفضلة لرواد المطار وشمال جدة.`,
    categoryId: 'news-development',
    categoryName: 'أخبار وتطوير أبحر الشمالية',
    coverImage: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'فريق التحرير الميداني',
      role: 'محرر الشؤون التنموية - @Northabhor',
    },
    publishDate: '2026-09-07',
    readTimeMinutes: 4,
    isBreaking: true,
    isFeatured: true,
    tags: ['جسر أبحر', 'مشاريع جدة', 'أبحر الشمالية', 'البنية التحتية'],
    tableOfContents: [
      { id: 'sec-1', title: 'مستجدات الإنجاز الميداني', level: 1 },
      { id: 'sec-2', title: 'أبرز المكتسبات الفنية للمشروع', level: 2 },
      { id: 'sec-3', title: 'الأثر على الحركة والتنقل اليومي', level: 2 },
    ],
    embeddedTable: {
      id: 'table_bridge_stats',
      title: 'مواصفات وجدول إنجاز جسر أبحر المعلق 2026',
      headers: ['المعيار الفني', 'المواصفة / القيمة', 'ملاحظات الإنجاز'],
      rows: [
        ['الطول الإجمالي للجسر', '350 متراً بحرياً', 'اكتمال بنسبة 100%'],
        ['العرض الكلي', '74 متراً (8 مسارات + ترام)', 'جاهزية المسارات بنسبة 85%'],
        ['الارتفاع الملاحي الصافي', '65 متراً فوق سطح البحر', 'يسمح بمرور كافة السفن واليخوت'],
        ['نسبة الإنجاز الكلية', '82.4%', 'جارٍ شد الكوابل الفولاذية الرئيسية'],
        ['الموعد التقديري للافتتاح التجريبي', 'الربع الأخير من عام 2026', 'أمانة جدة وشركة مترو جدة'],
      ],
      source: 'مكتب الرصد التنموي - @Northabhor',
      updatedAt: 'سبتمبر 2026',
    },
    views: 4890,
  },
  {
    id: 'art_2',
    slug: 'schools-guide-north-obhur-directory',
    title: 'دليل أولياء الأمور: الخريطة الشاملة لمدارس أبحر الشمالية (العالمية والأهلية والحكومية)',
    summary: 'تقرير تفصيلي مدعوم بجدول تفاعلي يستعرض المدارس المعتمدة في أحياء الياقوت والشراع والصواري مع مقارنة الرسوم والمناهج الدراسية.',
    content: `مع النمو السكاني الكبير في أحياء أبحر الشمالية خلال العامين الأخيرين، أصبحت المنظومة التعليمية في صدارة اهتمامات العائلات المنتقلة حديثاً.

يقدم هذا التقرير عبر **@Northabhor** مسحاً شاملاً لأكثر من 20 منشأة تعليمية مصنفة حسب المنهج المتبع والموقع الجغرافي ومتوسط الرسوم.

### معايير اختيار المدارس في شمال أبحر:
1. **القرب وسهولة الوصول:** تجنب نقاط الكثافة المرورية عبر شوارع عابر القارات والأمير عبدالمجيد.
2. **الاعتمادات الدولية:** مثل اعتمادات Cognia و Cambridge و IB للراغبين في المسارات العالمية.
3. **الأنشطة اللاصفية والبيئة المدرسية:** توفر مسابح وملاعب رياضية ومختبرات روبوت وذكاء اصطناعي.

استعرض الجدول التفاعلي المرفق لمعرفة تصنيفات المدارس وبيانات التواصل المباشر.`,
    categoryId: 'schools-directory',
    categoryName: 'دليل المدارس والمؤسسات التعليمية',
    coverImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'ساهر - اسأل أبحر',
      role: 'مؤسس المنصة @Northabhor',
    },
    publishDate: '2026-09-05',
    readTimeMinutes: 5,
    isBreaking: false,
    isFeatured: true,
    tags: ['مدارس أبحر', 'التعليم', 'دليل المدارس', 'أحياء شمال جدة'],
    tableOfContents: [
      { id: 'sec-1', title: 'الواقع التعليمي في أبحر الشمالية', level: 1 },
      { id: 'sec-2', title: 'معايير اختيار المدارس في شمال أبحر', level: 2 },
      { id: 'sec-3', title: 'قائمة المنشآت والرسوم التقديرية', level: 2 },
    ],
    views: 3410,
  },
  {
    id: 'art_3',
    slug: 'jeddah-tower-and-kingdom-city-update',
    title: 'استئناف البناء في برج جدة: كيف تعيد مدينة المملكة رسم الخريطة الاقتصادية لشمال أبحر؟',
    summary: 'تحليل اقتصادي واستثماري حول عودة الأعمال الإنشائية في البرج الأطول عالمياً وتأثيره المباشر على قيمة الأراضي السكنية والتجارية المجاورة.',
    content: `يمثل استئناف العمل في **برج جدة** العملاق علامة فارقة في المشهد العمراني لمدينة جدة ككل، ولأبحر الشمالية وخليج سلمان على وجه الخصوص.

يمتد المشروع على مساحة تزيد عن 5.3 مليون متر مربع ضمن رؤية طموحة لخلق مدينة متكاملة ذكية ومستدامة.

### مؤشرات التنمية المصاحبة:
- خطط لتمديد مسارات النقل السريع وخطوط الحافلات الذكية نحو موقع البرج.
- افتتاح محاور تجارية جديدة موازية لشارع عابر القارات وطريق الملك عبدالعزيز.
- زيادة الإقبال على المخططات الاستثمارية كحي الزمرد وحي اللؤلؤ بنسبة تجاوزت **34%** خلال الأشهر الستة الماضية.`,
    categoryId: 'analysis-guides',
    categoryName: 'المقالات والتحليلات',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'محلل العقار والتنمية',
      role: 'قسم التحليلات - @Northabhor',
    },
    publishDate: '2026-09-02',
    readTimeMinutes: 6,
    isBreaking: false,
    isFeatured: true,
    tags: ['برج جدة', 'مدينة المملكة', 'الاستثمار العقاري', 'شمال جدة'],
    tableOfContents: [
      { id: 'sec-1', title: 'أبعاد استئناف البناء', level: 1 },
      { id: 'sec-2', title: 'مؤشرات التنمية المصاحبة', level: 2 },
      { id: 'sec-3', title: 'توقعات الأسعار للعام القادم', level: 2 },
    ],
    views: 5200,
  },
  {
    id: 'art_4',
    slug: 'waterfront-promenade-north-obhur-launch',
    title: 'تدشين المرحلة النهائية لممشى وواجهة أبحر الشمالية الساحلية: 4.5 كم من المسارات الترفيهية',
    summary: 'أمانة محافظة جدة تعلن الجاهزية الكاملة للواجهة البحرية لشاطئ الإسكندرية مع توفير شواطئ رملية مجهزة ومواقف ذكية للمركبات الكهربائية.',
    content: `افتتحت رسمياً المرحلة النهائية من **ممشى وواجهة أبحر الشمالية البحرية** لتوفر للسكان متنفساً ساحلياً عصرياً بمواصفات عالمية.

يتضمن الممشى مسارات مطاطية للجري ومساراً إسفلتياً منفصلاً للدراجات الهوائية والكهربائية، إلى جانب 14 منطقة ألعاب تفاعلية ومقاهٍ مطلة مباشرة على البحر الأحمر.`,
    categoryId: 'projects-services',
    categoryName: 'المشاريع والخدمات',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'فريق التحرير الميداني',
      role: 'محرر الشؤون التنموية - @Northabhor',
    },
    publishDate: '2026-08-28',
    readTimeMinutes: 3,
    isBreaking: false,
    isFeatured: false,
    tags: ['الواجهة البحرية', 'ممشى أبحر', 'جودة الحياة', 'سياحة جدة'],
    views: 2900,
  },
];

export const REAL_ESTATE_STATS: RealEstateIndex[] = [
  {
    neighborhood: 'حي الشاطئ (شمال)',
    averageMeterPriceResidential: 4850,
    averageMeterPriceCommercial: 8900,
    yearlyChangePercentage: 16.4,
    activityLevel: 'مرتفع جداً',
    topDemandType: 'فلل فاخرة ومجمعات سكنية',
  },
  {
    neighborhood: 'حي الياقوت',
    averageMeterPriceResidential: 3600,
    averageMeterPriceCommercial: 6800,
    yearlyChangePercentage: 14.8,
    activityLevel: 'مرتفع جداً',
    topDemandType: 'أراضي وفلل عائلية مودرن',
  },
  {
    neighborhood: 'حي الشراع',
    averageMeterPriceResidential: 3450,
    averageMeterPriceCommercial: 6200,
    yearlyChangePercentage: 13.2,
    activityLevel: 'مرتفع',
    topDemandType: 'أدوار منفصلة وشقق تمليك',
  },
  {
    neighborhood: 'حي الفردوس',
    averageMeterPriceResidential: 3800,
    averageMeterPriceCommercial: 7100,
    yearlyChangePercentage: 15.1,
    activityLevel: 'مرتفع',
    topDemandType: 'فلل مستقلة ومكاتب خدمات',
  },
  {
    neighborhood: 'حي الصواري',
    averageMeterPriceResidential: 2950,
    averageMeterPriceCommercial: 5400,
    yearlyChangePercentage: 18.2,
    activityLevel: 'مرتفع جداً',
    topDemandType: 'مخططات سكنية واعدة وأراضٍ',
  },
  {
    neighborhood: 'حي اللؤلؤ',
    averageMeterPriceResidential: 3100,
    averageMeterPriceCommercial: 5800,
    yearlyChangePercentage: 12.5,
    activityLevel: 'متوسط',
    topDemandType: 'شاليهات وفلل مطلة واستثمارية',
  },
  {
    neighborhood: 'حي الأمواج',
    averageMeterPriceResidential: 4200,
    averageMeterPriceCommercial: 7800,
    yearlyChangePercentage: 17.0,
    activityLevel: 'مرتفع جداً',
    topDemandType: 'عقارات قريبة من الكورنيش',
  },
  {
    neighborhood: 'حي الزمرد',
    averageMeterPriceResidential: 2750,
    averageMeterPriceCommercial: 4900,
    yearlyChangePercentage: 19.5,
    activityLevel: 'مرتفع جداً',
    topDemandType: 'أراضي استثمارية ومشاريع واعدة',
  },
];

export const COMMUNITY_METRICS: CommunityMetric[] = [
  {
    id: 'm_1',
    title: 'نسبة إنجاز جسر أبحر المعلق',
    value: '82.4%',
    change: '+4.2% هذا الشهر',
    trend: 'up',
    description: 'الأعمال جارية في صب المسارات العلوية وتثبيت الكوابل الفولاذية',
  },
  {
    id: 'm_2',
    title: 'مؤشر نمو الطلب العقاري والسكني',
    value: '+15.6%',
    change: 'مقارنة بنفس الفترة العام الماضي',
    trend: 'up',
    description: 'أحياء الياقوت والزمرد والصواري تتصدر معدلات الطلب والشراء',
  },
  {
    id: 'm_3',
    title: 'المنشآت التعليمية المرصودة',
    value: '38+ مدرسة',
    change: '4 مجمعات جديدة قيد الإنشاء',
    trend: 'up',
    description: 'تغطية للمناهج الوطنية والأمريكية والبريطانية واللغات',
  },
  {
    id: 'm_4',
    title: 'طول المماشي والمسارات المكتملة',
    value: '18.5 كم',
    change: 'مربوطة بالواجهة البحرية',
    trend: 'up',
    description: 'مسارات للمشاة والجري والدراجات الهوائية في مختلف الأحياء',
  },
];

export const INITIAL_REAL_ESTATE_INDEX = REAL_ESTATE_STATS;
export const INITIAL_COMMUNITY_METRICS = COMMUNITY_METRICS;

export const NEIGHBORHOODS = [
  'حي الياقوت',
  'حي الشاطئ (شمال)',
  'حي الشراع',
  'حي الفردوس',
  'حي الصواري',
  'حي اللؤلؤ',
  'حي الأمواج',
  'حي الزمرد',
  'حي النور',
  'أبحر الجنوبية (المحيط)',
];

