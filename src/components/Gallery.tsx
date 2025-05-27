import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean | null;
  created_at: string;
}

const Gallery = () => {
  const { data: galleryItems, isLoading, error } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      console.log('Fetching gallery items from Supabase...');
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);
      
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

  if (error) {
    return (
      <section id="gallery" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-rhino-blue mb-4">Gallery</h2>
              <p className="text-rhino-gray text-lg">Capturing moments that define our journey</p>
            </div>
            <div className="text-center text-red-600">
              <p>Unable to load gallery. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Camera className="text-rhino-red" size={32} />
              <h2 className="text-3xl font-bold text-rhino-blue">Gallery</h2>
            </div>
            <p className="text-rhino-gray text-lg">Capturing moments that define our journey</p>
          </div>

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
          ) : galleryItems && galleryItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryItems.map((item) => (
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
          ) : (
            <div className="text-center text-rhino-gray">
              <p>No gallery items available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/gallery/all">
              <button className="bg-rhino-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                View Full Gallery
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
