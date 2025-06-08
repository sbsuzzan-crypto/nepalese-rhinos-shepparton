
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface NewsEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

const NewsEmptyState: React.FC<NewsEmptyStateProps> = ({ hasFilters, onClearFilters }) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-lg">
      <Search className="h-16 w-16 text-rhino-gray mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-rhino-blue mb-2">No Articles Found</h3>
      <p className="text-rhino-gray">
        {hasFilters ? 
          "No articles match your current filters. Try adjusting your search." : 
          "No news articles available at the moment."
        }
      </p>
      {hasFilters && (
        <Button 
          className="mt-4" 
          variant="outline"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default NewsEmptyState;
