
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useAllNews } from "@/hooks/useNews";
import NewsCard from "@/components/news/NewsCard";
import NewsFilters from "@/components/news/NewsFilters";
import NewsPagination from "@/components/news/NewsPagination";
import NewsLoadingSkeleton from "@/components/news/NewsLoadingSkeleton";
import NewsEmptyState from "@/components/news/NewsEmptyState";

const AllNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { data: articles, isLoading, error } = useAllNews(searchTerm, selectedCategory);

  const filteredArticles = articles || [];
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
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
            <NewsFilters
              searchTerm={searchTerm}
              setSearchTerm={handleSearch}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
              onReset={handleFilterReset}
            />

            {/* Loading State */}
            {isLoading && <NewsLoadingSkeleton count={9} />}

            {/* Error State */}
            {error && (
              <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                <p className="text-red-600 mb-4">Failed to load news articles. Please try again later.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && filteredArticles.length === 0 && (
              <NewsEmptyState
                hasFilters={!!(searchTerm || selectedCategory)}
                onClearFilters={handleFilterReset}
              />
            )}

            {/* Articles Grid */}
            {!isLoading && !error && paginatedArticles.length > 0 && (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                <NewsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
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
