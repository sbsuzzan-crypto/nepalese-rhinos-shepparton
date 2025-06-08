
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Breadcrumb from "@/components/Breadcrumb";
import ShareButton from "@/components/ShareButton";
import SEOHead from "@/components/SEOHead";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft } from "lucide-react";
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

const NewsArticle = () => {
  const { id } = useParams();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['news-article', id],
    queryFn: async () => {
      if (!id) throw new Error('No article ID provided');
      
      console.log('Fetching news article:', id);
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
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
      return format(new Date(dateString), "EEEE, MMMM do, yyyy");
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
        <Header />
        <Breadcrumb />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <LoadingSpinner size="lg" className="py-20" />
            </div>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
        <Header />
        <Breadcrumb />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-rhino-blue mb-4">Article Not Found</h1>
              <p className="text-rhino-gray mb-8">The article you're looking for doesn't exist or has been removed.</p>
              <Link to="/all-news">
                <Button className="bg-rhino-blue hover:bg-blue-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to News
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <SEOHead
        title={article.title}
        description={article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        image={article.image_url}
        type="article"
      />
      <Header />
      <Breadcrumb />
      
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Link to="/all-news">
                <Button variant="ghost" className="gap-2 text-rhino-blue hover:text-rhino-red">
                  <ArrowLeft className="h-4 w-4" />
                  Back to News
                </Button>
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-rhino-blue mb-4 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-6 text-rhino-gray">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                </div>
                
                <ShareButton
                  url={window.location.href}
                  title={article.title}
                  text={article.excerpt}
                />
              </div>

              {article.image_url && (
                <div className="aspect-video overflow-hidden rounded-lg mb-8">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </header>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none text-rhino-gray prose-headings:text-rhino-blue prose-links:text-rhino-red prose-strong:text-rhino-blue"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-rhino-blue">Share this article</h3>
                <ShareButton
                  url={window.location.href}
                  title={article.title}
                  text={article.excerpt}
                />
              </div>
            </div>

            {/* Back to News */}
            <div className="mt-12 text-center">
              <Link to="/all-news">
                <Button className="bg-rhino-blue hover:bg-blue-700">
                  View More News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default NewsArticle;
