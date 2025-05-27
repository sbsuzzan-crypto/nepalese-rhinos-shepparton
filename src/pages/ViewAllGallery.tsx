
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Calendar, Search, Filter, X } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean | null;
  created_at: string;
}

const ViewAllGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const { data: galleryItems, isLoading, error } = useQuery({
    queryKey: ['all-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  const categories = [
    { value: 'match_days', label: 'Match Days' },
    { value: 'training', label: 'Training' },
    { value: 'events', label: 'Events' },
    { value: 'team_photos', label: 'Team Photos' },
    { value: 'community', label: 'Community' },
  ];

  const filteredItems = galleryItems?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const getCategoryColor = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case 'match_days': return 'bg-red-500';
      case 'training': return 'bg-blue-500';
      case 'events': return 'bg-green-500';
      case 'team_photos': return 'bg-purple-500';
      case 'community': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryLabel = (category: string | null) => {
    const found = categories.find(c => c.value === category);
    return found?.label || 'Gallery';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center text-red-600">
              <p>Unable to load gallery. Please try again later.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Camera className="text-rhino-red" size={40} />
                <h1 className="text-4xl font-bold text-rhino-blue">Complete Gallery</h1>
              </div>
              <p className="text-rhino-gray text-lg">
                Explore all our captured moments and memories
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search gallery..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Filter by category:</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
                {selectedCategory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            </div>

            {/* Results count */}
            {!isLoading && (
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {filteredItems.length} of {galleryItems?.length || 0} images
                  {selectedCategory && ` in ${getCategoryLabel(selectedCategory)}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
            )}

            {/* Gallery Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 20 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="w-full h-64" />
                    <CardContent className="p-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${item.is_featured ? 'ring-2 ring-rhino-red' : ''}`}
                    onClick={() => setSelectedImage(item)}
                  >
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
                        <span>{format(new Date(item.created_at), "MMM d, yyyy")}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No images found</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory 
                    ? "Try adjusting your search or filter criteria"
                    : "No gallery items available at the moment"
                  }
                </p>
                {(searchTerm || selectedCategory) && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0">
          {selectedImage && (
            <>
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="flex items-center gap-2">
                  <Badge className={`${getCategoryColor(selectedImage.category)} text-white`}>
                    {getCategoryLabel(selectedImage.category)}
                  </Badge>
                  {selectedImage.is_featured && (
                    <Badge className="bg-yellow-500 text-white">Featured</Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <img 
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="w-full max-h-96 object-contain rounded-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h2>
                {selectedImage.description && (
                  <p className="text-gray-600 mb-4">{selectedImage.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  <span>{format(new Date(selectedImage.created_at), "MMMM d, yyyy")}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewAllGallery;
