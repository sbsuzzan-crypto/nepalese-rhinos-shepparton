
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
import { Users, Plus, Edit, Trash2, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import FileUpload from '@/components/admin/FileUpload';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
import type { Tables } from '@/integrations/supabase/types';

// Use the actual database schema type
type StaffMember = Tables<'staff'>;

const StaffManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photo_url: '',
    is_active: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addStaffMutation = useMutation({
    mutationFn: async (staffData: {
      name: string;
      role: string;
      bio?: string;
      photo_url?: string;
      is_active: boolean;
    }) => {
      const { error } = await supabase
        .from('staff')
        .insert([staffData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setIsDialogOpen(false);
      setEditingStaff(null);
      resetForm();
      toast({
        title: 'Success',
        description: 'Staff member added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add staff member',
        variant: 'destructive',
      });
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: async ({ id, ...staffData }: Partial<StaffMember> & { id: string }) => {
      const { error } = await supabase
        .from('staff')
        .update(staffData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setIsDialogOpen(false);
      setEditingStaff(null);
      resetForm();
      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update staff member',
        variant: 'destructive',
      });
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
      toast({
        title: 'Success',
        description: 'Staff member deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete staff member',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const staffData = {
      name: formData.name,
      role: formData.role,
      bio: formData.bio || undefined,
      photo_url: formData.photo_url || undefined,
      is_active: true,
    };

    if (editingStaff) {
      updateStaffMutation.mutate({ id: editingStaff.id, ...staffData });
    } else {
      addStaffMutation.mutate(staffData);
    }
  };

  const handleEdit = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      role: staffMember.role,
      bio: staffMember.bio || '',
      photo_url: staffMember.photo_url || '',
      is_active: staffMember.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (staff: StaffMember) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (staffToDelete) {
      deleteStaffMutation.mutate(staffToDelete.id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      photo_url: '',
      is_active: true
    });
    setEditingStaff(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Loading staff...</p>
      </div>
    );
  }

  const activeStaff = staff?.filter(s => s.is_active) || [];
  const inactiveStaff = staff?.filter(s => !s.is_active) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-600">Manage club staff and personnel</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-rhino-red to-red-700 hover:from-red-700 hover:to-red-800">
              <Plus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </DialogTitle>
                <DialogDescription>
                  Enter the details for the staff member.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Manager, Coach, Assistant"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Photo</Label>
                  <FileUpload
                    onUpload={(url) => setFormData({ ...formData, photo_url: url })}
                    accept="image/*"
                    fileType="image"
                    existingUrl={formData.photo_url}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                  />
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
                  disabled={addStaffMutation.isPending || updateStaffMutation.isPending}
                >
                  {editingStaff ? 'Update' : 'Add'} Staff Member
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
            <CardTitle className="text-sm font-medium text-slate-600">Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeStaff.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Inactive Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-600">{inactiveStaff.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{staff?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Staff Members
          </CardTitle>
          <CardDescription>
            Manage all club staff and personnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staff && staff.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {member.photo_url ? (
                          <img 
                            src={member.photo_url} 
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{member.name}</p>
                          {member.bio && (
                            <p className="text-sm text-slate-500 truncate max-w-xs">{member.bio}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{member.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.is_active ? 'default' : 'secondary'}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">
                        {member.created_at ? format(new Date(member.created_at), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(member)}
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
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No staff members</h3>
              <p className="text-slate-600">Add your first staff member to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Delete Dialog */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={staffToDelete?.name || ''}
        itemType="Staff Member"
        isLoading={deleteStaffMutation.isPending}
        description={`Are you sure you want to delete ${staffToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default StaffManagement;
