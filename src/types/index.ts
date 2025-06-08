
// Core entity types
export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category?: string;
  author?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  slug?: string;
  status?: 'draft' | 'published';
  views?: number;
}

// Alias for NewsArticle to match component expectations
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  created_at: string;
  updated_at: string;
  is_published?: boolean;
  news_categories?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface Fixture {
  id: string;
  opponent: string;
  match_date: string;
  venue: string;
  is_home?: boolean;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled' | 'postponed';
  home_score?: number;
  away_score?: number;
  match_report?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  division?: string;
  season: string;
  logo?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  jersey_number?: number;
  team_id?: string;
  photo?: string;
  age?: number;
  nationality?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  cover_image?: string;
  images: string[];
  category?: string;
  created_at: string;
  updated_at: string;
}

// Utility types
export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}
