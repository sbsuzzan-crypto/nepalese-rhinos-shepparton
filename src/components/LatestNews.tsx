
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLatestNews } from "@/hooks/useNews";
import NewsCard from "@/components/news/NewsCard";
import NewsLoadingSkeleton from "@/components/news/NewsLoadingSkeleton";

const LatestNews = () => {
  const { data: articles, isLoading, error } = useLatestNews(3);

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
            <NewsLoadingSkeleton count={3} />
          ) : articles && articles.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
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
