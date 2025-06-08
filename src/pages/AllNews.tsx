
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Calendar, User, ChevronRight, Filter, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface NewsArticle {
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

interface Category {
  id: string;
  name: string;
  color: string;
}

const AllNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data: categories } = useQuery({
    queryKey: ['news-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['all-news', searchTerm, selectedCategory, currentPage],
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

  const getReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(' ').length;
    const avgWordsPerMinute = 200;
    return Math.ceil(words / avgWordsPerMinute);
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-gray-50">
      <SEOHead
        title="All News"
        description="Stay updated with the latest news, match reports, and announcements from Nepalese Rhinos FC"
      />
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-rhino-blue mb-4">Latest News</h1>
              <p className="text-lg text-rhino-gray max-w-2xl mx-auto">
                Stay updated with the latest news, match reports, and announcements from Nepalese Rhinos FC
              </p>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                {/* Search Bar */}
                <div className="relative flex-1">
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

                {/* Category Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="h-4 w-4 text-rhino-gray" />
                  <Badge
                    variant={selectedCategory === "" ? "default" : "outline"}
                    className={`cursor-pointer ${selectedCategory === "" ? 'bg-rhino-blue text-white' : 'hover:bg-rhino-blue/10'}`}
                    onClick={() => {
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                  >
                    All Categories
                  </Badge>
                  {categories?.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedCategory === category.id 
                          ? 'text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                      style={selectedCategory === category.id ? { backgroundColor: category.color } : {}}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCurrentPage(1);
                      }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, index) => (
                  <Card key={index} className="overflow-hidden border-0 shadow-lg">
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
              <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                <p className="text-red-600 mb-4">Failed to load news articles. Please try again later.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && filteredArticles.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                <Search className="h-16 w-16 text-rhino-gray mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-rhino-blue mb-2">No Articles Found</h3>
                <p className="text-rhino-gray">
                  {searchTerm || selectedCategory ? 
                    "No articles match your current filters. Try adjusting your search." : 
                    "No news articles available at the moment."
                  }
                </p>
                {(searchTerm || selectedCategory) && (
                  <Button 
                    className="mt-4" 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Articles Grid */}
            {!isLoading && !error && paginatedArticles.length > 0 && (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-lg bg-white">
                      {article.featured_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={article.featured_image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        {/* Category Badge */}
                        {article.news_categories && (
                          <Badge 
                            className="text-white font-medium mb-3"
                            style={{ backgroundColor: article.news_categories.color }}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {article.news_categories.name}
                          </Badge>
                        )}

                        {/* Article Meta */}
                        <div className="flex items-center gap-4 text-sm text-rhino-gray mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(article.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>Admin</span>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-rhino-blue mb-3 line-clamp-2 group-hover:text-rhino-red transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-rhino-gray mb-4 line-clamp-3 leading-relaxed">
                          {article.excerpt || truncateText(article.content.replace(/<[^>]*>/g, ''), 150)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-rhino-gray">
                            {getReadingTime(article.content)} min read
                          </span>
                          <Link 
                            to={`/news/${article.id}`}
                            className="inline-flex items-center gap-2 text-rhino-red hover:text-red-700 font-semibold transition-colors"
                          >
                            Read More
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 bg-white rounded-lg shadow-lg p-4">
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
                            className={currentPage === page ? "bg-rhino-blue hover:bg-blue-700" : ""}
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
