
// Core entity types
export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category?: string;
  author?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  slug?: string;
  status?: 'draft' | 'published';
  views?: number;
}

export interface Fixture {
  id: string;
  home_team: string;
  away_team: string;
  match_date: string;
  match_time: string;
  venue: string;
  competition?: string;
  status: 'upcoming' | 'live' | 'completed';
  home_score?: number;
  away_score?: number;
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
