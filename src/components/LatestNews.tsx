
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string;
  created_at: string;
}

const LatestNews = () => {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ['latest-news'],
    queryFn: async () => {
      console.log('Fetching latest news from Supabase...');
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(6);
      
      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
      
      console.log('News fetched successfully:', data);
      return data as NewsItem[];
    },
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Recent";
    }
  };

  if (error) {
    return (
      <section id="news" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-rhino-blue mb-4">Latest News</h2>
              <p className="text-rhino-gray text-lg">Stay updated with the latest from Nepalese Rhinos FC</p>
            </div>
            <div className="text-center text-red-600">
              <p>Unable to load news. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Latest News</h2>
            <p className="text-rhino-gray text-lg">Stay updated with the latest from Nepalese Rhinos FC</p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : news && news.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article, index) => (
                <Link key={article.id} to={`/news/${article.id}`}>
                  <Card className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                    <div className="relative">
                      <img 
                        src={article.featured_image_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop'}
                        alt={article.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-rhino-red text-white">News</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-rhino-gray mb-2">
                        <Calendar size={14} />
                        <span>{formatDate(article.published_at || article.created_at)}</span>
                      </div>
                      <CardTitle className="text-lg hover:text-rhino-red transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-rhino-gray mb-4 line-clamp-3">
                        {article.excerpt || article.content.substring(0, 150) + '...'}
                      </p>
                      <div className="flex items-center text-rhino-red font-semibold hover:text-rhino-blue transition-colors">
                        <span>Read More</span>
                        <ArrowRight size={16} className="ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-rhino-gray">
              <p>No news available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button className="bg-rhino-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              View All News
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
