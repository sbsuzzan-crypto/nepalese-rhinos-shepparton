
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import GalleryFilters from "@/components/admin/gallery/GalleryFilters";
import type { Database } from '@/integrations/supabase/types';

type GalleryCategory = Database['public']['Enums']['gallery_category'];

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: GalleryCategory | null;
  is_featured: boolean | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 12;

const GalleryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | 'all'>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { data: galleryItems, isLoading, error } = useQuery({
    queryKey: ['gallery-full'],
    queryFn: async () => {
      console.log('Fetching full gallery from Supabase...');
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching gallery:', error);
        throw error;
      }
      
      console.log('Gallery items fetched successfully:', data);
      return data as GalleryItem[];
    },
  });

  const filteredItems = galleryItems?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    const matchesFeatured = !showFeaturedOnly || item.is_featured === true;
    
    return matchesSearch && matchesCategory && matchesFeatured;
  }) || [];

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || showFeaturedOnly;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowFeaturedOnly(false);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Recent";
    }
  };

  const getCategoryColor = (category: GalleryCategory | null) => {
    switch (category?.toLowerCase()) {
      case 'match_days': return 'bg-red-500';
      case 'training': return 'bg-blue-500';
      case 'events': return 'bg-green-500';
      case 'team_photos': return 'bg-purple-500';
      case 'community': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: GalleryCategory | null) => {
    switch (category?.toLowerCase()) {
      case 'match_days': return 'Match Days';
      case 'training': return 'Training';
      case 'events': return 'Events';
      case 'team_photos': return 'Team Photos';
      case 'community': return 'Community';
      default: return 'Gallery';
    }
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Camera className="text-rhino-red" size={32} />
                <h1 className="text-4xl font-bold text-rhino-blue">Full Gallery</h1>
              </div>
              <p className="text-rhino-gray text-lg">Explore all our captured moments</p>
            </div>

            <div className="mb-8">
              <GalleryFilters
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
                selectedCategory={selectedCategory}
                onCategoryChange={(category) => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                showFeaturedOnly={showFeaturedOnly}
                onFeaturedToggle={() => {
                  setShowFeaturedOnly(!showFeaturedOnly);
                  setCurrentPage(1);
                }}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {error ? (
              <div className="text-center text-red-600">
                <p>Unable to load gallery. Please try again later.</p>
              </div>
            ) : isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="w-full h-64" />
                    <CardContent className="p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : currentItems.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
                    {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {currentItems.map((item) => (
                    <Card key={item.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${item.is_featured ? 'ring-2 ring-rhino-red' : ''}`}>
                      <div className="relative overflow-hidden">
                        <img 
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={`${getCategoryColor(item.category)} text-white`}>
                            {getCategoryLabel(item.category)}
                          </Badge>
                        </div>
                        {item.is_featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-yellow-500 text-white">Featured</Badge>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                          {item.description && (
                            <p className="text-white/80 text-sm line-clamp-2">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-sm text-rhino-gray">
                          <Calendar size={14} />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    
                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                {hasActiveFilters ? (
                  <>
                    <p className="text-gray-500 text-lg mb-4">No items match your current filters.</p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </>
                ) : (
                  <p className="text-rhino-gray">No gallery items available at the moment.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default GalleryPage;
