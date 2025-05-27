
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Plus } from 'lucide-react';

interface GalleryEmptyStateProps {
  onAddImage: () => void;
}

const GalleryEmptyState = ({ onAddImage }: GalleryEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No gallery items</h3>
        <p className="text-gray-600 mb-4">Get started by adding your first image</p>
        <Button onClick={onAddImage} className="bg-rhino-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </CardContent>
    </Card>
  );
};

export default GalleryEmptyState;
