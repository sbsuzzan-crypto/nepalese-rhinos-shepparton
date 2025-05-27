
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
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

interface GalleryItemCardProps {
  item: GalleryItem;
  onEdit: (item: GalleryItem) => void;
  onDelete: (item: GalleryItem) => void;
}

const getCategoryColor = (category: GalleryCategory | null) => {
  switch (category) {
    case 'match_days': return 'bg-red-500';
    case 'training': return 'bg-blue-500';
    case 'events': return 'bg-green-500';
    case 'team_photos': return 'bg-purple-500';
    case 'community': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

const getCategoryLabel = (category: GalleryCategory | null) => {
  switch (category) {
    case 'match_days': return 'Match Days';
    case 'training': return 'Training';
    case 'events': return 'Events';
    case 'team_photos': return 'Team Photos';
    case 'community': return 'Community';
    default: return 'Unknown';
  }
};

const GalleryItemCard = ({ item, onEdit, onDelete }: GalleryItemCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className={`${getCategoryColor(item.category)} text-white`}>
            {getCategoryLabel(item.category)}
          </Badge>
        </div>
        {item.is_featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="featured">Featured</Badge>
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-sm">{item.title}</CardTitle>
            <CardDescription className="text-xs">
              {format(new Date(item.created_at), 'MMM d, yyyy')}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(item)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {item.description && (
        <CardContent className="pt-0">
          <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
        </CardContent>
      )}
    </Card>
  );
};

export default GalleryItemCard;
