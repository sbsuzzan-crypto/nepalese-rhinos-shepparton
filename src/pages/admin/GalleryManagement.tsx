
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Edit, Plus, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/admin/FileUpload';
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

const GalleryManagement = () => {
  const { isAdmin, isModerator } = useAuth();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    image_url: string;
    category: GalleryCategory;
    is_featured: boolean;
  }>({
    title: '',
    description: '',
    image_url: '',
    category: 'team_photos',
    is_featured: false
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      category: item.category || 'team_photos',
      is_featured: item.is_featured || false
    });
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
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: 'team_photos',
      is_featured: false
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const getCategoryColor = (category: GalleryCategory | null) => {
    switch (category) {
      case 'match_days': return 'bg-red-500';
      case 'training': return 'bg-blue-500';
      case 'events': return 'bg-green-500';
      case 'team_photos': return 'bg-purple-500';
      case 'community': return 'bg-yellow-500';
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
          onClick={() => setShowForm(!showForm)}
          className="bg-rhino-red hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
            </CardTitle>
            <CardDescription>
              Fill out the form below to {editingItem ? 'update' : 'add'} a gallery item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: GalleryCategory) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match_days">Match Days</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="team_photos">Team Photos</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Featured Image</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label>Image</Label>
                <FileUpload
                  onUpload={(url) => setFormData({ ...formData, image_url: url })}
                  accept="image/*"
                  existingUrl={formData.image_url}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-rhino-blue hover:bg-blue-700">
                  {editingItem ? 'Update' : 'Add'} Gallery Item
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {galleryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
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
                  <Badge className="bg-yellow-500 text-white">Featured</Badge>
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
                    onClick={() => handleEdit(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
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
        ))}
      </div>

      {galleryItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No gallery items</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first image</p>
            <Button onClick={() => setShowForm(true)} className="bg-rhino-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GalleryManagement;
