
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, Calendar, Search, Filter, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean | null;
  created_at: string;
}

const AllGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const { data: galleryItems, isLoading, error } = useQuery({
    queryKey: ['all-gallery'],
    queryFn: async () => {
      console.log('Fetching all gallery items from Supabase...');
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Recent";
    }
  };

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
    switch (category?.toLowerCase()) {
      case 'match_days': return 'Match Days';
      case 'training': return 'Training';
      case 'events': return 'Events';
      case 'team_photos': return 'Team Photos';
      case 'community': return 'Community';
      default: return 'Gallery';
    }
  };

  // Filter gallery items based on search and category
  const filteredItems = galleryItems?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(galleryItems?.map(item => item.category).filter(Boolean))) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-rhino-blue mb-4">Gallery</h1>
              <div className="text-center text-red-600">
                <p>Unable to load gallery. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rhino-blue to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-blue-200 mb-6">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <Camera size={40} />
              <h1 className="text-4xl font-bold">Gallery</h1>
            </div>
            <p className="text-xl text-blue-100">
              Capturing moments that define our journey at Nepalese Rhinos FC
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search gallery..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="Filter by category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category || ''}>
                        {getCategoryLabel(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredItems.length} of {galleryItems?.length || 0} images
            </p>
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No images found</h3>
              <p className="text-gray-500">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No gallery items available at the moment'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full overflow-auto">
            <div className="relative">
              <img 
                src={selectedImage.image_url}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </Button>
            </div>
            <div className="bg-white p-6 mt-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getCategoryColor(selectedImage.category)} text-white`}>
                  {getCategoryLabel(selectedImage.category)}
                </Badge>
                {selectedImage.is_featured && (
                  <Badge className="bg-yellow-500 text-white">Featured</Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h2>
              {selectedImage.description && (
                <p className="text-gray-600 mb-4">{selectedImage.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={14} />
                <span>{formatDate(selectedImage.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllGallery;
