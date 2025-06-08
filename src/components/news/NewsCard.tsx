
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ChevronRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsArticle } from "@/types";
import { formatDate, truncateText, getReadingTime, stripHtml } from "@/utils/formatters";

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  return (
    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group border-0 shadow-lg bg-white ${featured ? 'lg:col-span-2' : ''}`}>
      {article.featured_image_url && (
        <div className={`overflow-hidden ${featured ? 'aspect-[2/1]' : 'aspect-video'}`}>
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
        
        <h3 className={`font-bold text-rhino-blue mb-3 line-clamp-2 group-hover:text-rhino-red transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
          {article.title}
        </h3>
        
        <p className={`text-rhino-gray mb-4 line-clamp-3 leading-relaxed ${featured ? 'text-lg' : ''}`}>
          {article.excerpt || truncateText(stripHtml(article.content), featured ? 200 : 150)}
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
  );
};

export default NewsCard;
