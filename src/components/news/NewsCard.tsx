
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate, formatRelativeTime, getReadingTime, stripHtml, truncateText } from "@/utils/formatters";

interface NewsCardProps {
  article: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    featured_image_url?: string;
    created_at: string;
    updated_at?: string;
    is_published?: boolean;
    news_categories?: {
      id: string;
      name: string;
      color: string;
    };
  };
  variant?: 'default' | 'featured' | 'compact';
}

const NewsCard = ({ article, variant = 'default' }: NewsCardProps) => {
  const readingTime = getReadingTime(article.content);
  const excerpt = article.excerpt || truncateText(stripHtml(article.content), 120);
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
      <Link to={`/news/${article.id}`} className="block">
        {/* Featured Image */}
        {article.featured_image_url && (
          <div className={`relative overflow-hidden ${isFeatured ? 'h-48 sm:h-64' : isCompact ? 'h-32 sm:h-40' : 'h-40 sm:h-48'}`}>
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Category Badge */}
            {article.news_categories && (
              <div className="absolute top-3 left-3">
                <Badge 
                  className="text-white border-white/20 text-xs font-medium"
                  style={{ 
                    backgroundColor: article.news_categories.color || '#3B82F6',
                    color: 'white'
                  }}
                >
                  {article.news_categories.name}
                </Badge>
              </div>
            )}

            {/* Reading Time */}
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs">
                <Clock className="w-3 h-3" />
                <span>{readingTime} min</span>
              </div>
            </div>
          </div>
        )}

        <CardContent className={`p-4 sm:p-6 ${isCompact ? 'p-3 sm:p-4' : ''}`}>
          {/* Category (if no image) */}
          {!article.featured_image_url && article.news_categories && (
            <div className="mb-3">
              <Badge 
                className="text-xs font-medium"
                style={{ 
                  backgroundColor: `${article.news_categories.color}20`,
                  color: article.news_categories.color || '#3B82F6',
                  border: `1px solid ${article.news_categories.color}30`
                }}
              >
                {article.news_categories.name}
              </Badge>
            </div>
          )}

          {/* Title */}
          <h3 className={`font-bold text-rhino-blue group-hover:text-rhino-red transition-colors duration-200 line-clamp-2 mb-2 sm:mb-3 ${
            isFeatured ? 'text-xl sm:text-2xl' : isCompact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
          }`}>
            {article.title}
          </h3>

          {/* Excerpt */}
          {!isCompact && (
            <p className={`text-slate-700 line-clamp-3 mb-3 sm:mb-4 ${
              isFeatured ? 'text-base' : 'text-sm'
            }`}>
              {excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className="hidden sm:inline">{formatDate(article.created_at)}</span>
                <span className="sm:hidden">{formatRelativeTime(article.created_at)}</span>
              </div>
              
              {!isCompact && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{readingTime} min read</span>
                </div>
              )}
            </div>

            {/* Read More Arrow */}
            <div className="text-rhino-red group-hover:translate-x-1 transition-transform duration-200">
              →
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default NewsCard;
