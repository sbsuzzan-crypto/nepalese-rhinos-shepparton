
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GalleryForm from '@/components/admin/gallery/GalleryForm';
import GalleryItemCard from '@/components/admin/gallery/GalleryItemCard';
import GalleryEmptyState from '@/components/admin/gallery/GalleryEmptyState';
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

const GalleryManagement = () => {
  const { isAdmin, isModerator } = useAuth();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin || isModerator) {
      fetchGalleryItems();
    }
  }, [isAdmin, isModerator]);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch gallery items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: {
    title: string;
    description: string;
    image_url: string;
    category: GalleryCategory;
    is_featured: boolean;
  }) => {
    try {
      const itemData = {
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url,
        category: formData.category,
        is_featured: formData.is_featured
      };

      if (editingItem) {
        const { error } = await supabase
          .from('gallery')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Gallery item updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('gallery')
          .insert(itemData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Gallery item created successfully",
        });
      }

      resetForm();
      fetchGalleryItems();
    } catch (error: any) {
      console.error('Error saving gallery item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save gallery item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
      fetchGalleryItems();
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleAddImage = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  if (!isAdmin && !isModerator) {
    return (
      <Alert>
        <AlertDescription>
          You don't have permission to access this page.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-gray-600">Manage gallery images and content</p>
        </div>
        <Button 
          onClick={handleAddImage}
          className="bg-rhino-red hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      {showForm && (
        <GalleryForm
          editingItem={editingItem}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      {galleryItems.length === 0 ? (
        <GalleryEmptyState onAddImage={handleAddImage} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <GalleryItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
