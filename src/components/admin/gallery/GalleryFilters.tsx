
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import SearchInput from "../SearchInput";
import type { Database } from '@/integrations/supabase/types';

type GalleryCategory = Database['public']['Enums']['gallery_category'];

interface GalleryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: GalleryCategory | 'all';
  onCategoryChange: (category: GalleryCategory | 'all') => void;
  showFeaturedOnly: boolean;
  onFeaturedToggle: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const GalleryFilters = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showFeaturedOnly,
  onFeaturedToggle,
  onClearFilters,
  hasActiveFilters
}: GalleryFiltersProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search gallery items..."
          className="md:col-span-2"
        />
        
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="match_days">Match Days</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="events">Events</SelectItem>
            <SelectItem value="team_photos">Team Photos</SelectItem>
            <SelectItem value="community">Community</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={showFeaturedOnly ? "default" : "outline"}
            onClick={onFeaturedToggle}
            size="sm"
            className="flex-1"
          >
            Featured Only
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              size="sm"
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchTerm}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {selectedCategory.replace('_', ' ')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onCategoryChange('all')}
              />
            </Badge>
          )}
          {showFeaturedOnly && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Featured Only
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={onFeaturedToggle}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryFilters;
