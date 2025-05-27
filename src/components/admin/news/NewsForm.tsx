
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import FileUpload from '@/components/admin/FileUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { Tables } from '@/integrations/supabase/types';

type NewsArticle = Tables<'news'>;

interface NewsFormProps {
  editingNews: NewsArticle | null;
  onSubmit: (data: {
    title: string;
    content: string;
    excerpt?: string;
    featured_image_url?: string;
    is_published: boolean;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const NewsForm = ({ editingNews, onSubmit, onCancel, isLoading }: NewsFormProps) => {
  const [formData, setFormData] = useState({
    title: editingNews?.title || '',
    content: editingNews?.content || '',
    excerpt: editingNews?.excerpt || '',
    featured_image_url: editingNews?.featured_image_url || '',
    is_published: editingNews?.is_published || false
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newsData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt || undefined,
      featured_image_url: formData.featured_image_url || undefined,
      is_published: formData.is_published,
    };

    onSubmit(newsData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {editingNews ? 'Edit News Article' : 'Add New News Article'}
        </DialogTitle>
        <DialogDescription>
          Create engaging news content for your website.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="excerpt">Excerpt (Optional)</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Brief summary for article previews..."
            rows={2}
          />
        </div>
        <div className="grid gap-2">
          <Label>Featured Image</Label>
          <FileUpload
            onUpload={(url) => setFormData({ ...formData, featured_image_url: url })}
            accept="image/*"
            fileType="image"
            existingUrl={formData.featured_image_url}
          />
        </div>
        <div className="grid gap-2">
          <RichTextEditor
            label="Content"
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Write your news article content here..."
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
          />
          <Label htmlFor="is_published">Publish immediately</Label>
        </div>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
        >
          {editingNews ? 'Update' : 'Add'} Article
        </Button>
      </DialogFooter>
    </form>
  );
};

export default NewsForm;
