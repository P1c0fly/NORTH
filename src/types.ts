export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  count?: number;
  icon?: string;
  isCustom?: boolean;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface DataTableData {
  id: string;
  title: string;
  description?: string;
  headers: string[];
  rows: (string | number)[][];
  source?: string;
  updatedAt?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  categoryName: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishDate: string;
  readTimeMinutes: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  tags: string[];
  tableOfContents?: TableOfContentsItem[];
  embeddedTable?: DataTableData;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  views: number;
}

export interface School {
  id: string;
  name: string;
  type: 'أهلي' | 'عالمي' | 'حكومي' | 'حضانة ورياض أطفال';
  gender: 'بنين' | 'بنات' | 'مشترك';
  stages: string[];
  neighborhood: string;
  curriculum: string;
  rating: number;
  reviewsCount: number;
  feesRange: string;
  phone: string;
  address: string;
  accredited: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: 'بنية تحتية' | 'نقل وجسور' | 'واجهات بحرية وتطوير' | 'أبراج وعقارات' | 'خدمات صحية وتعليمية';
  neighborhood: string;
  status: 'قيد التنفيذ' | 'مكتمل' | 'مرحلة التخطيط والترسية' | 'تحديث جزئي';
  progressPercentage: number;
  budget?: string;
  completionDate: string;
  description: string;
  image: string;
  contractorOrOwner?: string;
  keyHighlights: string[];
}

export interface RealEstateIndex {
  neighborhood: string;
  averageMeterPriceResidential: number;
  averageMeterPriceCommercial: number;
  yearlyChangePercentage: number;
  activityLevel: 'مرتفع جداً' | 'مرتفع' | 'متوسط';
  topDemandType: string;
}

export interface CommunityMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

export interface AskObhurQueryResponse {
  answer: string;
  thinkingProcess?: string;
  recommendedPlaces?: string[];
  relevantProjects?: string[];
  confidence: 'high' | 'medium';
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'super_admin' | 'editor';
  token: string;
}
