
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import Breadcrumb from "@/components/Breadcrumb";
import ShareButton from "@/components/ShareButton";
import SEOHead from "@/components/SEOHead";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft, Clock, Tag } from "lucide-react";
import { useNewsArticle } from "@/hooks/useNews";
import { formatDateTime, getReadingTime } from "@/utils/formatters";
import NewsComments from "@/components/NewsComments";

const NewsArticle = () => {
  const { id } = useParams();
  const { data: article, isLoading, error } = useNewsArticle(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
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
      <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
        <Header />
        <Breadcrumb />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center bg-white rounded-lg shadow-lg p-12">
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
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <SEOHead
        title={article.title}
        description={article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        image={article.featured_image_url}
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
                <Button variant="ghost" className="gap-2 text-rhino-blue hover:text-rhino-red hover:bg-white">
                  <ArrowLeft className="h-4 w-4" />
                  Back to News
                </Button>
              </Link>
            </div>

            {/* Article Container */}
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Featured Image */}
              {article.featured_image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.featured_image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-8">
                {/* Category Badge */}
                {article.news_categories && (
                  <div className="mb-4">
                    <Badge 
                      className="text-white font-medium"
                      style={{ backgroundColor: article.news_categories.color }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {article.news_categories.name}
                    </Badge>
                  </div>
                )}

                {/* Article Header */}
                <header className="mb-8">
                  <h1 className="text-4xl font-bold text-rhino-blue mb-6 leading-tight">
                    {article.title}
                  </h1>
                  
                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-6 text-rhino-gray">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{formatDateTime(article.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Admin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{getReadingTime(article.content)} min read</span>
                      </div>
                    </div>
                    
                    <ShareButton
                      url={window.location.href}
                      title={article.title}
                      text={article.excerpt}
                    />
                  </div>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <div className="bg-gray-50 p-6 rounded-lg mb-8 border-l-4 border-rhino-blue">
                      <p className="text-lg text-rhino-gray leading-relaxed italic">
                        {article.excerpt}
                      </p>
                    </div>
                  )}
                </header>

                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none text-rhino-gray prose-headings:text-rhino-blue prose-links:text-rhino-red prose-strong:text-rhino-blue prose-p:leading-relaxed prose-p:mb-6"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t border-gray-200 bg-gray-50 -mx-8 px-8 py-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-rhino-blue mb-2">Share this article</h3>
                      <p className="text-rhino-gray">Help spread the word about Nepalese Rhinos FC</p>
                    </div>
                    <ShareButton
                      url={window.location.href}
                      title={article.title}
                      text={article.excerpt}
                    />
                  </div>
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <div className="mt-8">
              <NewsComments newsId={article.id} />
            </div>

            {/* Back to News */}
            <div className="mt-12 text-center">
              <Link to="/all-news">
                <Button className="bg-rhino-blue hover:bg-blue-700 px-8 py-3">
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
