
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heart, Eye, Calendar, CheckCircle, X, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type SupportersMessage = Tables<'supporters_messages'>;

const SupportersMessagesManagement = () => {
  const [selectedMessage, setSelectedMessage] = useState<SupportersMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const approveMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('supporters_messages')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supporters_messages'] });
      toast({
        title: 'Success',
        description: 'Message approved successfully',
      });
    },
  });

  const publishMessageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('supporters_messages')
        .update({ is_published: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supporters_messages'] });
      toast({
        title: 'Success',
        description: 'Message published successfully',
      });
    },
  });

  const handleViewDetails = (message: SupportersMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };

  const pendingMessages = messages?.filter(m => !m.is_approved) || [];
  const approvedMessages = messages?.filter(m => m.is_approved && !m.is_published) || [];
  const publishedMessages = messages?.filter(m => m.is_published) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Supporters Messages</h1>
          <p className="text-slate-600">Manage fan messages and testimonials</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingMessages.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{approvedMessages.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{publishedMessages.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-600">{messages?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Fan Messages
          </CardTitle>
          <CardDescription>
            Review and manage messages from supporters
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : messages && messages.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div className="font-medium text-slate-900">{message.name}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{message.email || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {message.message.substring(0, 50)}...
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={message.is_approved ? "default" : "secondary"}>
                          {message.is_approved ? 'Approved' : 'Pending'}
                        </Badge>
                        {message.is_published && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Published
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {message.created_at ? format(new Date(message.created_at), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(message)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!message.is_approved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => approveMessageMutation.mutate(message.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {message.is_approved && !message.is_published && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => publishMessageMutation.mutate(message.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Publish
                          </Button>
                        )}
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

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Full details of the supporter message
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Name</label>
                  <p className="text-slate-900">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Email</label>
                  <p className="text-slate-900">{selectedMessage.email || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Message</label>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-md whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <div className="flex flex-col gap-1 mt-1">
                    <Badge variant={selectedMessage.is_approved ? "default" : "secondary"}>
                      {selectedMessage.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                    {selectedMessage.is_published && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Published
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Received On</label>
                  <p className="text-slate-900">
                    {selectedMessage.created_at ? format(new Date(selectedMessage.created_at), 'MMMM dd, yyyy') : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportersMessagesManagement;
