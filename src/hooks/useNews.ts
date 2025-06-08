
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsArticle } from "@/types";

export const useLatestNews = (limit: number = 3) => {
  return useQuery({
    queryKey: ['latest-news', limit],
    queryFn: async () => {
      console.log('Fetching latest news...');
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          news_categories(id, name, color)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
      
      console.log('Latest news fetched successfully:', data);
      return data as NewsArticle[];
    },
  });
};

export const useNewsArticle = (id: string) => {
  return useQuery({
    queryKey: ['news-article', id],
    queryFn: async () => {
      if (!id) throw new Error('No article ID provided');
      
      console.log('Fetching news article:', id);
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          news_categories(id, name, color)
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single();
      
      if (error) {
        console.error('Error fetching article:', error);
        throw error;
      }
      
      console.log('Article fetched successfully:', data);
      return data as NewsArticle;
    },
    enabled: !!id,
  });
};

export const useAllNews = (searchTerm: string = "", selectedCategory: string = "") => {
  return useQuery({
    queryKey: ['all-news', searchTerm, selectedCategory],
    queryFn: async () => {
      console.log('Fetching all news articles...');
      let query = supabase
        .from('news')
        .select(`
          *,
          news_categories(id, name, color)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
      
      console.log('News articles fetched successfully:', data);
      return data as NewsArticle[];
    },
  });
};
