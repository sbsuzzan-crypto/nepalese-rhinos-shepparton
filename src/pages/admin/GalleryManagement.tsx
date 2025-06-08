import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GalleryForm from '@/components/admin/gallery/GalleryForm';
import GalleryItemCard from '@/components/admin/gallery/GalleryItemCard';
import GalleryEmptyState from '@/components/admin/gallery/GalleryEmptyState';
import GalleryFilters from '@/components/admin/gallery/GalleryFilters';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | 'all'>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin || isModerator) {
      fetchGalleryItems();
      
      // Set up realtime subscription for better performance
      const channel = supabase
        .channel('gallery-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'gallery'
          },
          (payload) => {
            console.log('Gallery realtime update:', payload);
            fetchGalleryItems();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin, isModerator]);

  const fetchGalleryItems = async () => {
    try {
      console.log('Fetching gallery items...');
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery items:', error);
        throw error;
      }
      console.log('Gallery items fetched:', data);
      setGalleryItems(data || []);
    } catch (error: any) {
      console.error('Error fetching gallery items:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch gallery items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return galleryItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      const matchesFeatured = !showFeaturedOnly || item.is_featured === true;
      
      return matchesSearch && matchesCategory && matchesFeatured;
    });
  }, [galleryItems, searchTerm, selectedCategory, showFeaturedOnly]);

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || showFeaturedOnly;

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowFeaturedOnly(false);
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
        console.log('Updating gallery item:', editingItem.id);
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
        console.log('Creating new gallery item');
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

  const handleDelete = (item: GalleryItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      console.log('Deleting gallery item:', itemToDelete.id);
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('Gallery item deleted successfully');
      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
      fetchGalleryItems();
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete gallery item",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
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

      <GalleryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        showFeaturedOnly={showFeaturedOnly}
        onFeaturedToggle={() => setShowFeaturedOnly(!showFeaturedOnly)}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {filteredItems.length === 0 ? (
        galleryItems.length === 0 ? (
          <GalleryEmptyState onAddImage={handleAddImage} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items match your current filters.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredItems.length} of {galleryItems.length} items
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <GalleryItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}

      {/* Custom Delete Dialog */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.title || ''}
        itemType="Gallery Item"
        isLoading={isDeleting}
        description={`Are you sure you want to delete "${itemToDelete?.title}"? This will permanently remove the image from the gallery.`}
      />
    </div>
  );
};

export default GalleryManagement;
