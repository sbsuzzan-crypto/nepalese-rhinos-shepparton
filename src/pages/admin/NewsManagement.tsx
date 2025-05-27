
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Edit, Plus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/admin/FileUpload';
import { format } from 'date-fns';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const NewsManagement = () => {
  const { isAdmin, isModerator } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    is_published: false
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin || isModerator) {
      fetchNews();
    }
  }, [isAdmin, isModerator]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error: any) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to fetch news",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newsData = {
        ...formData,
        published_at: formData.is_published ? new Date().toISOString() : null
      };

      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', editingNews.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "News updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('news')
          .insert([newsData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "News created successfully",
        });
      }

      setFormData({
        title: '',
        content: '',
        excerpt: '',
        featured_image_url: '',
        is_published: false
      });
      setEditingNews(null);
      setShowForm(false);
      fetchNews();
    } catch (error: any) {
      console.error('Error saving news:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save news",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt || '',
      featured_image_url: newsItem.featured_image_url || '',
      is_published: newsItem.is_published
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "News deleted successfully",
      });
      fetchNews();
    } catch (error: any) {
      console.error('Error deleting news:', error);
      toast({
        title: "Error",
        description: "Failed to delete news",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featured_image_url: '',
      is_published: false
    });
    setEditingNews(null);
    setShowForm(false);
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
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-gray-600">Create and manage news articles</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-rhino-red hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add News
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingNews ? 'Edit News' : 'Create New News'}
            </CardTitle>
            <CardDescription>
              Fill out the form below to {editingNews ? 'update' : 'create'} a news article
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the article"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={8}
                />
              </div>

              <div>
                <Label>Featured Image</Label>
                <FileUpload
                  onUpload={(url) => setFormData({ ...formData, featured_image_url: url })}
                  accept="image/*"
                  fileType="image"
                  existingUrl={formData.featured_image_url}
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

              <div className="flex gap-4">
                <Button type="submit" className="bg-rhino-blue hover:bg-blue-700">
                  {editingNews ? 'Update' : 'Create'} News
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {news.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {item.title}
                    {item.is_published ? (
                      <Badge className="bg-green-500">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Created: {format(new Date(item.created_at), 'PPP')}
                    {item.published_at && (
                      <> • Published: {format(new Date(item.published_at), 'PPP')}</>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {item.featured_image_url && (
                <img
                  src={item.featured_image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-gray-600 mb-2">{item.excerpt}</p>
              <p className="text-sm text-gray-500 line-clamp-3">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {news.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Eye className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No news articles</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first news article</p>
            <Button onClick={() => setShowForm(true)} className="bg-rhino-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Create News Article
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewsManagement;
