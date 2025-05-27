
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import FileUpload from '@/components/admin/FileUpload';
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

interface GalleryFormProps {
  editingItem: GalleryItem | null;
  onSubmit: (formData: {
    title: string;
    description: string;
    image_url: string;
    category: GalleryCategory;
    is_featured: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

const GalleryForm = ({ editingItem, onSubmit, onCancel }: GalleryFormProps) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    image_url: string;
    category: GalleryCategory;
    is_featured: boolean;
  }>({
    title: editingItem?.title || '',
    description: editingItem?.description || '',
    image_url: editingItem?.image_url || '',
    category: editingItem?.category || 'team_photos',
    is_featured: editingItem?.is_featured || false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
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
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GalleryForm;
