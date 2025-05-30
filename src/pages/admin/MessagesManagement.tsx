
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Mail, Users, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
import type { Database } from '@/integrations/supabase/types';

type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
type JoinSubmission = Database['public']['Tables']['join_submissions']['Row'];

const MessagesManagement = () => {
  const [selectedTab, setSelectedTab] = useState('contact');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: 'contact' | 'join' } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contactMessages, isLoading: loadingContact } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      console.log('Fetching contact messages...');
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact messages:', error);
        throw error;
      }
      console.log('Contact messages fetched:', data);
      return data as ContactMessage[];
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const { data: joinSubmissions, isLoading: loadingJoin } = useQuery({
    queryKey: ['join-submissions'],
    queryFn: async () => {
      console.log('Fetching join submissions...');
      const { data, error } = await supabase
        .from('join_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching join submissions:', error);
        throw error;
      }
      console.log('Join submissions fetched:', data);
      return data as JoinSubmission[];
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const markContactAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Marking contact message as read:', id);
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      queryClient.refetchQueries({ queryKey: ['contact-messages'] });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contact message:', id);
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      console.log('Contact message deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      queryClient.refetchQueries({ queryKey: ['contact-messages'] });
      toast({
        title: 'Success',
        description: 'Contact message deleted successfully',
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error: any) => {
      console.error('Delete contact mutation error:', error);
      toast({
        title: 'Error',
        description: `Failed to delete message: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteJoinMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting join submission:', id);
      const { error } = await supabase
        .from('join_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      console.log('Join submission deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join-submissions'] });
      queryClient.refetchQueries({ queryKey: ['join-submissions'] });
      toast({
        title: 'Success',
        description: 'Join submission deleted successfully',
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error: any) => {
      console.error('Delete join mutation error:', error);
      toast({
        title: 'Error',
        description: `Failed to delete submission: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleMarkContactAsRead = (id: string) => {
    markContactAsReadMutation.mutate(id);
  };

  const handleDeleteContact = (id: string, name: string) => {
    setItemToDelete({ id, name, type: 'contact' });
    setDeleteDialogOpen(true);
  };

  const handleDeleteJoin = (id: string, name: string) => {
    setItemToDelete({ id, name, type: 'join' });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'contact') {
        deleteContactMutation.mutate(itemToDelete.id);
      } else {
        deleteJoinMutation.mutate(itemToDelete.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages Management</h1>
        <p className="text-gray-600">Manage contact messages and join requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{contactMessages?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Join Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{joinSubmissions?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Unread Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {contactMessages?.filter(m => !m.is_read).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending Joins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {joinSubmissions?.filter(j => j.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Messages
          </TabsTrigger>
          <TabsTrigger value="join" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Join Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          {loadingContact ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading contact messages...</p>
            </div>
          ) : contactMessages && contactMessages.length > 0 ? (
            <div className="space-y-4">
              {contactMessages.map((message) => (
                <Card key={message.id} className={message.is_read ? 'opacity-75' : 'border-l-4 border-l-blue-500'}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-gray-900">{message.subject || 'No Subject'}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">{message.name}</span>
                          <Badge variant="outline">{message.email}</Badge>
                          <Badge variant={message.is_read ? 'secondary' : 'destructive'}>
                            {message.is_read ? 'Read' : 'Unread'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!message.is_read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkContactAsRead(message.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteContact(message.id, message.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">{message.message}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(message.created_at!), 'PPpp')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No contact messages</h3>
                <p className="text-gray-600">Messages will appear here when users contact you</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="join" className="space-y-4">
          {loadingJoin ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading join requests...</p>
            </div>
          ) : joinSubmissions && joinSubmissions.length > 0 ? (
            <div className="space-y-4">
              {joinSubmissions.map((submission) => (
                <Card key={submission.id} className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-gray-900">{submission.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{submission.email}</Badge>
                          <Badge variant="outline">{submission.position_interest}</Badge>
                          <Badge 
                            variant={submission.status === 'pending' ? 'destructive' : 'secondary'}
                          >
                            {submission.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJoin(submission.id, submission.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {submission.phone && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Phone:</span>
                          <p className="text-sm text-gray-600">{submission.phone}</p>
                        </div>
                      )}
                      {submission.experience_level && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Experience:</span>
                          <p className="text-sm text-gray-600">{submission.experience_level}</p>
                        </div>
                      )}
                    </div>
                    {submission.message && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">Message:</span>
                        <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">{submission.message}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      {format(new Date(submission.created_at!), 'PPpp')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No join requests</h3>
                <p className="text-gray-600">Join requests will appear here when users apply</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Custom Delete Confirmation Dialog */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || ''}
        itemType={itemToDelete?.type === 'contact' ? 'Contact Message' : 'Join Request'}
        isLoading={deleteContactMutation.isPending || deleteJoinMutation.isPending}
        description={`Are you sure you want to delete the ${itemToDelete?.type === 'contact' ? 'message' : 'join request'} from ${itemToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default MessagesManagement;
