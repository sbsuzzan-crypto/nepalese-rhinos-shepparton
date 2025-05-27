
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NewsForm from '@/components/admin/news/NewsForm';
import NewsTable from '@/components/admin/news/NewsTable';
import type { Tables } from '@/integrations/supabase/types';

type NewsArticle = Tables<'news'>;

const NewsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
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

  const handleFormSubmit = (newsData: {
    title: string;
    content: string;
    excerpt?: string;
    featured_image_url?: string;
    is_published: boolean;
  }) => {
    if (editingNews) {
      updateNewsMutation.mutate({ id: editingNews.id, ...newsData });
    } else {
      addNewsMutation.mutate(newsData);
    }
  };

  const handleEdit = (newsArticle: NewsArticle) => {
    setEditingNews(newsArticle);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteNewsMutation.mutate(id);
  };

  const resetForm = () => {
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
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-rhino-red to-red-700 hover:from-red-700 hover:to-red-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add News Article
          </Button>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <NewsForm
              editingNews={editingNews}
              onSubmit={handleFormSubmit}
              onCancel={resetForm}
              isLoading={addNewsMutation.isPending || updateNewsMutation.isPending}
            />
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
            <FileText className="w-5 h-5" />
            News Articles
          </CardTitle>
          <CardDescription>
            Manage all news articles and blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading news...</div>
          ) : (
            <NewsTable 
              news={news || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsManagement;
