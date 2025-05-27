import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { News, Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import FileUpload from '@/components/admin/FileUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { Tables } from '@/integrations/supabase/types';

type NewsArticle = Tables<'news'>;

const NewsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    is_published: false
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: news, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addNewsMutation = useMutation({
    mutationFn: async (newsData: {
      title: string;
      content: string;
      excerpt?: string;
      featured_image_url?: string;
      is_published: boolean;
      published_at?: string;
    }) => {
      const { error } = await supabase
        .from('news')
        .insert([{
          ...newsData,
          published_at: newsData.is_published ? new Date().toISOString() : null
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setIsDialogOpen(false);
      setEditingNews(null);
      toast({
        title: 'Success',
        description: 'News article added successfully',
      });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, ...newsData }: Partial<NewsArticle> & { id: string }) => {
      const updateData = {
        ...newsData,
        published_at: newsData.is_published 
          ? (newsData.published_at || new Date().toISOString())
          : null
      };
      
      const { error } = await supabase
        .from('news')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setIsDialogOpen(false);
      setEditingNews(null);
      toast({
        title: 'Success',
        description: 'News article updated successfully',
      });
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast({
        title: 'Success',
        description: 'News article deleted successfully',
      });
    },
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

    if (editingNews) {
      updateNewsMutation.mutate({ id: editingNews.id, ...newsData });
    } else {
      addNewsMutation.mutate(newsData);
    }
  };

  const handleEdit = (newsArticle: NewsArticle) => {
    setEditingNews(newsArticle);
    setFormData({
      title: newsArticle.title,
      content: newsArticle.content,
      excerpt: newsArticle.excerpt || '',
      featured_image_url: newsArticle.featured_image_url || '',
      is_published: newsArticle.is_published || false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteNewsMutation.mutate(id);
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
    setIsDialogOpen(false);
  };

  const publishedNews = news?.filter(n => n.is_published) || [];
  const draftNews = news?.filter(n => !n.is_published) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">News Management</h1>
          <p className="text-slate-600">Create and manage news articles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-rhino-red to-red-700 hover:from-red-700 hover:to-red-800">
              <Plus className="w-4 h-4 mr-2" />
              Add News Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addNewsMutation.isPending || updateNewsMutation.isPending}
                >
                  {editingNews ? 'Update' : 'Add'} Article
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Published Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{publishedNews.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Draft Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{draftNews.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{news?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <News className="w-5 h-5" />
            News Articles
          </CardTitle>
          <CardDescription>
            Manage all news articles and blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading news...</div>
          ) : news && news.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {article.featured_image_url ? (
                          <img 
                            src={article.featured_image_url} 
                            alt={article.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                            <News className="w-6 h-6 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{article.title}</p>
                          {article.excerpt && (
                            <p className="text-sm text-slate-500 truncate max-w-xs">{article.excerpt}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={article.is_published ? 'default' : 'secondary'}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {article.published_at 
                          ? format(new Date(article.published_at), 'MMM dd, yyyy')
                          : 'Not published'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {format(new Date(article.created_at), 'MMM dd, yyyy')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete News Article</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{article.title}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(article.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <News className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No news articles</h3>
              <p className="text-slate-600">Create your first news article to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsManagement;
