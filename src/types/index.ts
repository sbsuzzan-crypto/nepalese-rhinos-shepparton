
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  author_id?: string;
  created_at: string;
  is_published: boolean;
  published_at?: string;
  updated_at: string;
  category_id?: string;
  news_categories?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface Category {
  id: string;
  name: string;
  color: string;
  slug: string;
  description?: string;
  is_active: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string | null;
  description: string | null;
  is_active: boolean | null;
}

export interface Fixture {
  id: string;
  opponent: string;
  match_date: string;
  venue: string;
  is_home: boolean;
  status: string;
  home_score?: number;
  away_score?: number;
  match_report?: string;
}
