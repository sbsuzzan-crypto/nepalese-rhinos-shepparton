
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, User, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import RichTextEditor from '@/components/admin/RichTextEditor';
import FileUpload from '@/components/admin/FileUpload';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
import SearchInput from '@/components/admin/SearchInput';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { Database } from '@/integrations/supabase/types';

type NewsArticle = Database['public']['Tables']['news']['Row'] & {
  profiles?: {
    full_name: string | null;
  } | null;
};

const ITEMS_PER_PAGE = 10;

const NewsManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allNews, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      console.log('Fetching news articles with author information...');
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        throw error;
      }
      console.log('News articles fetched:', data);
      return data as NewsArticle[];
    },
  });

  // Filter news based on search term
  const filteredNews = allNews?.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const createMutation = useMutation({
    mutationFn: async (articleData: {
      title: string;
      excerpt: string;
      content: string;
      featured_image_url: string;
      is_published: boolean;
      author_id: string;
      published_at?: string;
    }) => {
      console.log('Creating news article:', articleData);
      const { data, error } = await supabase
        .from('news')
        .insert([{
          ...articleData,
          published_at: articleData.is_published ? new Date().toISOString() : null,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating news article:', error);
        throw error;
      }
      console.log('News article created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      setIsFormOpen(false);
      setEditingArticle(null);
      toast({
        title: 'Success',
        description: 'News article created successfully',
      });
    },
    onError: (error: any) => {
      console.error('Create mutation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create news article',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NewsArticle> & { id: string }) => {
      console.log('Updating news article:', id, updates);
      const updateData = {
        ...updates,
        published_at: updates.is_published ? 
          (updates.published_at || new Date().toISOString()) : 
          null,
      };
      
      const { data, error } = await supabase
        .from('news')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating news article:', error);
        throw error;
      }
      console.log('News article updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      setIsFormOpen(false);
      setEditingArticle(null);
      toast({
        title: 'Success',
        description: 'News article updated successfully',
      });
    },
    onError: (error: any) => {
      console.error('Update mutation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update news article',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting news article:', id);
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting news article:', error);
        throw error;
      }
      console.log('News article deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
      toast({
        title: 'Success',
        description: 'News article deleted successfully',
      });
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete news article',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const articleData = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      featured_image_url: formData.get('featured_image_url') as string || '',
      is_published: formData.get('is_published') === 'on',
      author_id: formData.get('author_id') as string,
    };

    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, ...articleData });
    } else {
      createMutation.mutate(articleData);
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleDelete = (article: NewsArticle) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (articleToDelete) {
      deleteMutation.mutate(articleToDelete.id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingArticle(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600">Create and manage club news articles</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rhino-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add News Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? 'Edit News Article' : 'Add New News Article'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingArticle?.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={editingArticle?.excerpt || ''}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  value={editingArticle?.content || ''}
                  onChange={(value) => {
                    const contentInput = document.querySelector('input[name="content"]') as HTMLInputElement;
                    if (contentInput) contentInput.value = value;
                  }}
                />
                <input type="hidden" name="content" defaultValue={editingArticle?.content || ''} />
              </div>
              <div>
                <Label htmlFor="featured_image_url">Featured Image</Label>
                <FileUpload
                  onUpload={(url) => {
                    const imageInput = document.querySelector('input[name="featured_image_url"]') as HTMLInputElement;
                    if (imageInput) imageInput.value = url;
                  }}
                />
                <input type="hidden" name="featured_image_url" defaultValue={editingArticle?.featured_image_url || ''} />
              </div>
              <div>
                <Label htmlFor="author_id">Author ID</Label>
                <Input
                  id="author_id"
                  name="author_id"
                  defaultValue={editingArticle?.author_id || ''}
                  placeholder="Enter author UUID"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  name="is_published"
                  defaultChecked={editingArticle?.is_published ?? false}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleFormClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingArticle ? 'Update' : 'Create'} Article
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search articles..."
          className="w-full sm:w-80"
        />
        <div className="text-sm text-gray-600">
          Showing {paginatedNews.length} of {filteredNews.length} articles
        </div>
      </div>

      {/* News Table */}
      <Card>
        <CardHeader>
          <CardTitle>News Articles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading articles...</p>
            </div>
          ) : paginatedNews.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="hidden md:table-cell">Author</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedNews.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-2">{article.title}</p>
                          {article.excerpt && (
                            <p className="text-sm text-gray-500 line-clamp-1 mt-1">{article.excerpt}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {article.profiles?.full_name || 'Unknown'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={article.is_published ? 'default' : 'secondary'}>
                          {article.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {format(new Date(article.created_at), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(article)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(article)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">No articles found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first news article to get started'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsFormOpen(true)} className="bg-rhino-red hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add News Article
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Delete Dialog */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={articleToDelete?.title || ''}
        itemType="News Article"
        isLoading={deleteMutation.isPending}
        description={`Are you sure you want to delete "${articleToDelete?.title}"? This will remove the article from all displays and cannot be undone.`}
      />
    </div>
  );
};

export default NewsManagement;
