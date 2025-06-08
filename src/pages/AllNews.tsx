
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, User, ChevronRight } from "lucide-react";
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

const AllNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['all-news', searchTerm, currentPage],
    queryFn: async () => {
      console.log('Fetching all news articles...');
      let query = supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
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

  const filteredArticles = articles || [];
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      
      <main className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-rhino-blue mb-4">Latest News</h1>
              <p className="text-lg text-rhino-gray max-w-2xl mx-auto">
                Stay updated with the latest news, match reports, and announcements from Nepalese Rhinos FC
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rhino-gray h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 w-full border-rhino-gray/20 focus:border-rhino-blue"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
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
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load news articles. Please try again later.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-rhino-gray mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-rhino-blue mb-2">No Articles Found</h3>
                <p className="text-rhino-gray">
                  {searchTerm ? `No articles match "${searchTerm}"` : "No news articles available at the moment."}
                </p>
              </div>
            )}

            {/* Articles Grid */}
            {!isLoading && !error && paginatedArticles.length > 0 && (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedArticles.map((article) => (
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
                          {article.excerpt || truncateText(article.content.replace(/<[^>]*>/g, ''), 150)}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? "bg-rhino-blue" : ""}
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default AllNews;
