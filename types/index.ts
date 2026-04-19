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
  source: 'telegram' | 'web';
  readStatus: boolean;
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
  | 'other';

export interface LinkFilters {
  category?: Category;
  tags?: string[];
  readStatus?: boolean;
  sortBy?: 'createdAt' | 'title';
  order?: 'asc' | 'desc';
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
