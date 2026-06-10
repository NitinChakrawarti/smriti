export interface Link {
  _id: string;
  url: string;
  title: string;
  description: string;
  summary: string;
  tags: string[];
  category: Category;
  contentType: ContentType;
  thumbnail: string;
  fileUrl?: string;
  fileType?: 'pdf' | 'image' | null;
  fileName?: string;
  fileSize?: number;
  source: 'telegram' | 'web' | 'pwa-share';
  readStatus: boolean;
  reminderAt?: string | null;
  reminderSent?: boolean;
  reminderDays?: number | null;
  keep?: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Category = 
  | 'Technology'
  | 'Business'
  | 'Design'
  | 'Marketing'
  | 'Development'
  | 'AI/ML'
  | 'Product'
  | 'Other';

export type ContentType = 
  | 'article'
  | 'video'
  | 'documentation'
  | 'blog'
  | 'news'
  | 'pdf'
  | 'image'
  | 'text'
  | 'other';

export interface LinkFilters {
  category?: Category;
  tags?: string[];
  readStatus?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'title';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Stats {
  total: number;
  read: number;
  unread: number;
  categories: Array<{
    _id: string;
    count: number;
  }>;
}
