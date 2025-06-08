
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
import { MessageSquare, Eye, EyeOff, Trash2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
import type { Tables } from '@/integrations/supabase/types';

type SupporterMessage = Tables<'supporters_messages'>;

const SupportersMessagesManagement = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<SupporterMessage | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['supporters_messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supporters_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SupporterMessage> }) => {
      const { error } = await supabase
        .from('supporters_messages')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supporters_messages'] });
      toast({
        title: 'Success',
        description: 'Message updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update message',
        variant: 'destructive',
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('supporters_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supporters_messages'] });
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
      toast({
        title: 'Success',
        description: 'Message deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete message',
        variant: 'destructive',
      });
    },
  });

  const handleApprove = (message: SupporterMessage) => {
    updateMessageMutation.mutate({
      id: message.id,
      updates: { is_approved: true }
    });
  };

  const handleReject = (message: SupporterMessage) => {
    updateMessageMutation.mutate({
      id: message.id,
      updates: { is_approved: false }
    });
  };

  const handlePublish = (message: SupporterMessage) => {
    updateMessageMutation.mutate({
      id: message.id,
      updates: { is_published: !message.is_published }
    });
  };

  const handleDelete = (message: SupporterMessage) => {
    setMessageToDelete(message);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (messageToDelete) {
      deleteMessageMutation.mutate(messageToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Loading messages...</p>
      </div>
    );
  }

  const approvedMessages = messages?.filter(m => m.is_approved) || [];
  const pendingMessages = messages?.filter(m => m.is_approved === null || m.is_approved === false) || [];
  const publishedMessages = messages?.filter(m => m.is_published) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Supporters Messages</h1>
          <p className="text-slate-600">Manage messages from supporters and fans</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{messages?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingMessages.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedMessages.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{publishedMessages.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            All Messages
          </CardTitle>
          <CardDescription>
            Review and manage supporters messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messages && messages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{message.name}</p>
                        {message.email && (
                          <p className="text-sm text-slate-500">{message.email}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-700 max-w-xs truncate">
                        {message.message}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant={
                            message.is_approved === true ? 'default' : 
                            message.is_approved === false ? 'destructive' : 'secondary'
                          }
                        >
                          {message.is_approved === true ? 'Approved' : 
                           message.is_approved === false ? 'Rejected' : 'Pending'}
                        </Badge>
                        {message.is_published && (
                          <Badge variant="outline" className="text-purple-600 border-purple-600">
                            Published
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {message.created_at ? format(new Date(message.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {message.is_approved !== true && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(message)}
                            disabled={updateMessageMutation.isPending}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        {message.is_approved !== false && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(message)}
                            disabled={updateMessageMutation.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        {message.is_approved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePublish(message)}
                            disabled={updateMessageMutation.isPending}
                          >
                            {message.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(message)}
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
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No messages</h3>
              <p className="text-slate-600">No supporter messages have been received yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Delete Dialog */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={messageToDelete?.name || ''}
        itemType="Supporter Message"
        isLoading={deleteMessageMutation.isPending}
        description={`Are you sure you want to delete the message from "${messageToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default SupportersMessagesManagement;
