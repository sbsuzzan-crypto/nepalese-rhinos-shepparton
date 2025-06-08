
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string;
  created_at: string;
  author_id: string | null;
}

const NewsArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['news-article', id],
    queryFn: async () => {
      if (!id) throw new Error('Article ID is required');
      
      console.log('Fetching news article:', id);
      const { data, error } = await supabase
        .from('news')
        .select('*')
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return "Unknown date";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return "";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-rhino-blue mb-4">Article Not Found</h1>
            <p className="text-rhino-gray mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')} className="bg-rhino-red hover:bg-red-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 text-rhino-blue hover:text-rhino-red"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : article ? (
            <article className="space-y-6">
              {/* Article Header */}
              <div className="space-y-4">
                <Badge className="bg-rhino-red text-white">News</Badge>
                
                <h1 className="text-4xl font-bold text-rhino-blue leading-tight">
                  {article.title}
                </h1>
                
                {article.excerpt && (
                  <p className="text-xl text-rhino-gray font-medium">
                    {article.excerpt}
                  </p>
                )}
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-rhino-gray border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(article.published_at || article.created_at)}</span>
                  </div>
                  {formatTime(article.published_at || article.created_at) && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{formatTime(article.published_at || article.created_at)}</span>
                    </div>
                  )}
                  {article.author_id && (
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>By Admin</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              {article.featured_image_url && (
                <Card className="overflow-hidden">
                  <img 
                    src={article.featured_image_url}
                    alt={article.title}
                    className="w-full h-96 object-cover"
                  />
                </Card>
              )}

              {/* Article Content */}
              <Card>
                <CardContent className="p-8">
                  <div 
                    className="prose prose-lg max-w-none text-rhino-gray"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </CardContent>
              </Card>

              {/* Share/Back Section */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="border-rhino-blue text-rhino-blue hover:bg-rhino-blue hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  More News
                </Button>
                
                <div className="text-sm text-rhino-gray">
                  Published on {formatDate(article.published_at || article.created_at)}
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default NewsArticle;
