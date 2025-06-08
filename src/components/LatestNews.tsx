
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  author: string;
  created_at: string;
  is_featured: boolean;
  status: string;
}

const LatestNews = () => {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['latest-news'],
    queryFn: async () => {
      console.log('Fetching latest news...');
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
      
      console.log('Latest news fetched successfully:', data);
      return data as NewsArticle[];
    },
  });

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM do, yyyy");
    } catch {
      return dateString;
    }
  };

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-rhino-blue">Latest News</h2>
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Unable to load latest news. Please try again later.</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Latest News</h2>
            <p className="text-lg text-rhino-gray">Stay updated with our latest match reports and club announcements</p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {articles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    {article.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-rhino-gray mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(article.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{article.author}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-rhino-blue mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-rhino-gray mb-4 line-clamp-3">
                        {article.excerpt || truncateText(article.content.replace(/<[^>]*>/g, ''), 120)}
                      </p>
                      
                      <Link 
                        to={`/news/${article.id}`}
                        className="inline-flex items-center gap-2 text-rhino-red hover:text-red-700 font-semibold transition-colors"
                      >
                        Read More
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Link to="/all-news">
                  <Button className="bg-rhino-blue hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold inline-flex items-center gap-2">
                    View All News
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-rhino-blue mb-2">No News Available</h3>
              <p className="text-rhino-gray">Check back soon for the latest updates from Nepalese Rhinos FC!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
