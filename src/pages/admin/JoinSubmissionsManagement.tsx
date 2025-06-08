import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { UserPlus, Eye, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
import type { Tables } from '@/integrations/supabase/types';

type JoinSubmission = Tables<'join_submissions'>;

const JoinSubmissionsManagement = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<JoinSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<JoinSubmission | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['join_submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('join_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('join_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join_submissions'] });
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    },
  });

  const deleteSubmissionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('join_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join_submissions'] });
      toast({
        title: 'Success',
        description: 'Application deleted successfully',
      });
      setDeleteDialogOpen(false);
      setSubmissionToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete application',
        variant: 'destructive',
      });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleViewDetails = (submission: JoinSubmission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  const handleDelete = (submission: JoinSubmission) => {
    setSubmissionToDelete(submission);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (submissionToDelete) {
      deleteSubmissionMutation.mutate(submissionToDelete.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Loading submissions...</p>
      </div>
    );
  }

  const pendingSubmissions = submissions?.filter(s => s.status === 'pending') || [];
  const approvedSubmissions = submissions?.filter(s => s.status === 'approved') || [];
  const rejectedSubmissions = submissions?.filter(s => s.status === 'rejected') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Join Submissions</h1>
          <p className="text-slate-600">Manage membership applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pendingSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approvedSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedSubmissions.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{submissions?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Membership Applications
          </CardTitle>
          <CardDescription>
            Review and manage join requests from potential members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submissions && submissions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position Interest</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{submission.name}</p>
                        {submission.phone && (
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {submission.phone}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{submission.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{submission.position_interest}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(submission.status || 'pending')}>
                        {submission.status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
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
                        <Select
                          value={submission.status || 'pending'}
                          onValueChange={(value) => handleStatusChange(submission.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(submission)}
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
              <UserPlus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No submissions</h3>
              <p className="text-slate-600">No membership applications have been received yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Full details of the membership application
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Name</label>
                  <p className="text-slate-900">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Email</label>
                  <p className="text-slate-900">{selectedSubmission.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Phone</label>
                  <p className="text-slate-900">{selectedSubmission.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Position Interest</label>
                  <p className="text-slate-900">{selectedSubmission.position_interest}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Experience Level</label>
                <p className="text-slate-900">{selectedSubmission.experience_level || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Message</label>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-md">
                  {selectedSubmission.message || 'No message provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Submitted On</label>
                <p className="text-slate-900">
                  {selectedSubmission.created_at ? format(new Date(selectedSubmission.created_at), 'MMMM dd, yyyy at HH:mm') : 'Unknown'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Custom Delete Dialog */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={submissionToDelete?.name || ''}
        itemType="Membership Application"
        isLoading={deleteSubmissionMutation.isPending}
        description={`Are you sure you want to delete the membership application from ${submissionToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default JoinSubmissionsManagement;
