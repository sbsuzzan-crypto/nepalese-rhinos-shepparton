
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Tag } from "lucide-react";
import { useNewsCategories } from "@/hooks/useCategories";

interface NewsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onReset: () => void;
}

const NewsFilters: React.FC<NewsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onReset
}) => {
  const { data: categories } = useNewsCategories();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rhino-gray h-4 w-4" />
          <Input
            type="text"
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border-rhino-gray/20 focus:border-rhino-blue"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-rhino-gray" />
          <Badge
            variant={selectedCategory === "" ? "default" : "outline"}
            className={`cursor-pointer ${selectedCategory === "" ? 'bg-rhino-blue text-white' : 'hover:bg-rhino-blue/10'}`}
            onClick={() => setSelectedCategory("")}
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
              onClick={() => setSelectedCategory(category.id)}
            >
              <Tag className="h-3 w-3 mr-1" />
              {category.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFilters;
