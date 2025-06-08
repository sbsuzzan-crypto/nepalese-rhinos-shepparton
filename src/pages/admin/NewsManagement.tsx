import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Newspaper, Plus, Edit, Trash2, Eye, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import RichTextEditor from '@/components/admin/RichTextEditor';
import FileUpload from '@/components/admin/FileUpload';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
import type { Tables } from '@/integrations/supabase/types';

type NewsArticle = Tables<'news'> & {
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
};

const NewsManagement = () => {
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      console.log('Fetching news articles with author information...');
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
      
      console.log('News articles fetched successfully:', data);
      return data as NewsArticle[];
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: async (newArticle: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at' | 'profiles'>) => {
      const { data, error } = await supabase
        .from('news')
        .insert([newArticle])
        .select()
        .single();

      if (error) {
        console.error('Error creating news article:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setFormDialogOpen(false);
      toast({
        title: 'Success',
        description: 'News article created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create news article',
        variant: 'destructive',
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NewsArticle> & { id: string }) => {
      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating news article:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setFormDialogOpen(false);
      toast({
        title: 'Success',
        description: 'News article updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update news article',
        variant: 'destructive',
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting news article:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setDeleteDialogOpen(false);
      toast({
        title: 'Success',
        description: 'News article deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete news article',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase.auth.getSession()) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create or update news articles.',
        variant: 'destructive',
      });
      return;
    }

    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const is_published = formData.get('is_published') === 'on';

    const articleData = {
      title,
      excerpt,
      content,
      featured_image_url: featuredImage,
      is_published,
      author_id: userId,
    };

    if (editingArticle) {
      updateArticleMutation.mutate({ id: editingArticle.id, ...articleData });
    } else {
      createArticleMutation.mutate(articleData);
    }
  };

  const handleDelete = (article: NewsArticle) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (articleToDelete) {
      deleteArticleMutation.mutate(articleToDelete.id);
    }
  };

  const handleCancel = () => {
    setFormDialogOpen(false);
    setEditingArticle(null);
  };

  const handleImageUpload = (url: string) => {
    setFeaturedImage(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Loading news articles...</p>
      </div>
    );
  }

  const publishedArticles = articles?.filter(a => a.is_published) || [];
  const draftArticles = articles?.filter(a => !a.is_published) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">News Management</h1>
          <p className="text-slate-600">Create and manage news articles</p>
        </div>
        <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-rhino-red to-red-700 hover:from-red-700 hover:to-red-800"
              onClick={() => {
                setEditingArticle(null);
                setContent('');
                setFeaturedImage('');
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingArticle ? 'Edit Article' : 'Add Article'}</DialogTitle>
              <DialogDescription>
                Create and manage news articles for the website.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingArticle?.title}
                    placeholder="Article Title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    defaultValue={editingArticle?.excerpt}
                    placeholder="Brief summary of the article"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <RichTextEditor 
                    value={content}
                    onChange={setContent}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="featured_image">Featured Image</Label>
                  <FileUpload 
                    onUpload={handleImageUpload}
                    initialUrl={featuredImage}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    name="is_published"
                    defaultChecked={editingArticle?.is_published ?? false}
                  />
                  <Label htmlFor="is_published">Publish</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingArticle ? 'Update Article' : 'Create Article'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{articles?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{publishedArticles.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{draftArticles.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            All Articles
          </CardTitle>
          <CardDescription>
            Manage your news articles and publications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {articles && articles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{article.title}</p>
                        {article.excerpt && (
                          <p className="text-sm text-slate-500 truncate max-w-xs">{article.excerpt}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {article.profiles?.full_name || 'Unknown Author'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {article.profiles?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={article.is_published ? 'default' : 'secondary'}>
                        {article.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {article.created_at ? format(new Date(article.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingArticle(article);
                            setContent(article.content);
                            setFeaturedImage(article.featured_image_url || '');
                            setFormDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setArticleToDelete(article);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Newspaper className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No articles</h3>
              <p className="text-slate-600">Create your first news article to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Delete Dialog */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          if (articleToDelete) {
            deleteArticleMutation.mutate(articleToDelete.id);
          }
        }}
        itemName={articleToDelete?.title || ''}
        itemType="News Article"
        isLoading={deleteArticleMutation.isPending}
        description={`Are you sure you want to delete "${articleToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default NewsManagement;
