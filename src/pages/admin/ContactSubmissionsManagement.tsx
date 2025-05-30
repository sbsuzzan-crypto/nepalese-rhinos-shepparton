
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
import { Mail, Eye, Calendar, Trash2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
import type { Tables } from '@/integrations/supabase/types';

type ContactSubmission = Tables<'contact_submissions'>;

const ContactSubmissionsManagement = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['contact_submissions'],
    queryFn: async () => {
      console.log('Fetching contact submissions...');
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact submissions:', error);
        throw error;
      }
      console.log('Contact submissions fetched:', data);
      return data;
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Marking submission as read:', id);
      const { error } = await supabase
        .from('contact_submissions')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_submissions'] });
      queryClient.refetchQueries({ queryKey: ['contact_submissions'] });
      toast({
        title: 'Success',
        description: 'Message marked as read',
      });
    },
  });

  const deleteSubmissionMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contact submission:', id);
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      console.log('Contact submission deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_submissions'] });
      queryClient.refetchQueries({ queryKey: ['contact_submissions'] });
      toast({
        title: 'Success',
        description: 'Message deleted successfully',
      });
      setDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: 'Error',
        description: `Failed to delete message: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
    
    if (!submission.is_read) {
      markAsReadMutation.mutate(submission.id);
    }
  };

  const handleDelete = (submission: ContactSubmission) => {
    setSubmissionToDelete(submission);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (submissionToDelete) {
      deleteSubmissionMutation.mutate(submissionToDelete.id);
    }
  };

  const unreadSubmissions = submissions?.filter(s => !s.is_read) || [];
  const readSubmissions = submissions?.filter(s => s.is_read) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600">Manage contact form submissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{unreadSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Read</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{readSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">{submissions?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <MessageSquare className="w-5 h-5" />
            Contact Messages
          </CardTitle>
          <CardDescription>
            Review and manage messages from website visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading messages...</p>
            </div>
          ) : submissions && submissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900">Name</TableHead>
                  <TableHead className="text-gray-900">Email</TableHead>
                  <TableHead className="text-gray-900">Subject</TableHead>
                  <TableHead className="text-gray-900">Status</TableHead>
                  <TableHead className="text-gray-900">Received</TableHead>
                  <TableHead className="text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} className={!submission.is_read ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{submission.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{submission.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-900">{submission.subject}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={submission.is_read ? "secondary" : "default"}>
                        {submission.is_read ? 'Read' : 'Unread'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {submission.created_at ? format(new Date(submission.created_at), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(submission)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {submission.is_read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(submission)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
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
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
              <p className="text-gray-600">No contact messages have been received yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Message Details</DialogTitle>
            <DialogDescription>
              Full details of the contact message
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedSubmission.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Subject</label>
                <p className="text-gray-900">{selectedSubmission.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Message</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                  {selectedSubmission.message}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Received On</label>
                <p className="text-gray-900">
                  {selectedSubmission.created_at ? format(new Date(selectedSubmission.created_at), 'MMMM dd, yyyy at HH:mm') : 'Unknown'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom Delete Confirmation Dialog */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={`message from ${submissionToDelete?.name || 'unknown'}`}
        itemType="Contact Message"
        isLoading={deleteSubmissionMutation.isPending}
        description={`Are you sure you want to delete the message from ${submissionToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default ContactSubmissionsManagement;
