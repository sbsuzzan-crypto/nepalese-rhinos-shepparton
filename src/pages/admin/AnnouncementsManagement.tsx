
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@/components/ui/switch';
import { Megaphone, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Announcement = Tables<'announcements'>;

const AnnouncementsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addAnnouncementMutation = useMutation({
    mutationFn: async (announcementData: {
      title: string;
      content: string;
      excerpt?: string;
      category: string;
      is_published: boolean;
      featured_image_url?: string;
    }) => {
      const { error } = await supabase
        .from('announcements')
        .insert([{
          ...announcementData,
          published_at: announcementData.is_published ? new Date().toISOString() : null,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      toast({
        title: 'Success',
        description: 'Announcement created successfully',
      });
    },
  });

  const updateAnnouncementMutation = useMutation({
    mutationFn: async ({ id, ...announcementData }: Partial<Announcement> & { id: string }) => {
      const { error } = await supabase
        .from('announcements')
        .update({
          ...announcementData,
          published_at: announcementData.is_published ? new Date().toISOString() : null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      toast({
        title: 'Success',
        description: 'Announcement updated successfully',
      });
    },
  });

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: 'Success',
        description: 'Announcement deleted successfully',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const announcementData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string || undefined,
      category: formData.get('category') as string,
      is_published: formData.get('is_published') === 'on',
      featured_image_url: formData.get('featured_image_url') as string || undefined,
    };

    if (editingAnnouncement) {
      updateAnnouncementMutation.mutate({ id: editingAnnouncement.id, ...announcementData });
    } else {
      addAnnouncementMutation.mutate(announcementData);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAnnouncementMutation.mutate(id);
  };

  const publishedAnnouncements = announcements?.filter(a => a.is_published) || [];
  const draftAnnouncements = announcements?.filter(a => !a.is_published) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Announcements Management</h1>
          <p className="text-slate-600">Manage club announcements and news</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-rhino-red to-red-700 hover:from-red-700 hover:to-red-800">
              <Plus className="w-4 h-4 mr-2" />
              Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
                </DialogTitle>
                <DialogDescription>
                  Create or edit announcements for the club website.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingAnnouncement?.title}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input
                    id="excerpt"
                    name="excerpt"
                    defaultValue={editingAnnouncement?.excerpt || ''}
                    placeholder="Brief description for preview"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={editingAnnouncement?.category || 'general'}
                    placeholder="general, match, event, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="featured_image_url">Featured Image URL</Label>
                  <Input
                    id="featured_image_url"
                    name="featured_image_url"
                    defaultValue={editingAnnouncement?.featured_image_url || ''}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    defaultValue={editingAnnouncement?.content}
                    rows={6}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    name="is_published"
                    defaultChecked={editingAnnouncement?.is_published}
                  />
                  <Label htmlFor="is_published">Publish immediately</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingAnnouncement(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addAnnouncementMutation.isPending || updateAnnouncementMutation.isPending}
                >
                  {editingAnnouncement ? 'Update' : 'Create'} Announcement
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
            <CardTitle className="text-sm font-medium text-slate-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{publishedAnnouncements.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{draftAnnouncements.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{announcements?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Announcements
          </CardTitle>
          <CardDescription>
            Manage all club announcements and news
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading announcements...</div>
          ) : announcements && announcements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{announcement.title}</p>
                        {announcement.excerpt && (
                          <p className="text-sm text-slate-500 truncate max-w-xs">{announcement.excerpt}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{announcement.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={announcement.is_published ? 'default' : 'secondary'}>
                        {announcement.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {announcement.created_at ? format(new Date(announcement.created_at), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(announcement)}
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
                              <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{announcement.title}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(announcement.id)}
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
              <Megaphone className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No announcements</h3>
              <p className="text-slate-600">Create your first announcement to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementsManagement;
