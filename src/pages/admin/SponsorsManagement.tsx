
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SponsorForm from '@/components/admin/sponsors/SponsorForm';
import SponsorCard from '@/components/admin/sponsors/SponsorCard';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
import type { Database } from '@/integrations/supabase/types';

type Sponsor = Database['public']['Tables']['sponsors']['Row'];

const SponsorsManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState<Sponsor | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sponsors, isLoading } = useQuery({
    queryKey: ['admin-sponsors'],
    queryFn: async () => {
      console.log('Fetching sponsors...');
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sponsors:', error);
        throw error;
      }
      console.log('Sponsors fetched:', data);
      return data as Sponsor[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting sponsor with ID:', id);
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      console.log('Sponsor deleted successfully');
    },
    onSuccess: () => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: ['admin-sponsors'] });
      queryClient.refetchQueries({ queryKey: ['admin-sponsors'] });
      
      toast({
        title: 'Success',
        description: 'Sponsor deleted successfully',
      });
      setDeleteDialogOpen(false);
      setSponsorToDelete(null);
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: 'Error',
        description: `Failed to delete sponsor: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setIsFormOpen(true);
  };

  const handleDelete = (sponsor: Sponsor) => {
    setSponsorToDelete(sponsor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (sponsorToDelete) {
      deleteMutation.mutate(sponsorToDelete.id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingSponsor(null);
  };

  const handleFormSuccess = () => {
    // Invalidate and refetch immediately
    queryClient.invalidateQueries({ queryKey: ['admin-sponsors'] });
    queryClient.refetchQueries({ queryKey: ['admin-sponsors'] });
    handleFormClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sponsors Management</h1>
          <p className="text-gray-600">Manage club sponsors and partners</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-rhino-red hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Sponsor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Sponsors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{sponsors?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Sponsors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sponsors?.filter(s => s.is_active).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Gold Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {sponsors?.filter(s => s.tier === 'gold').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Silver Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {sponsors?.filter(s => s.tier === 'silver').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sponsors Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading sponsors...</p>
        </div>
      ) : sponsors && sponsors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <SponsorCard
              key={sponsor.id}
              sponsor={sponsor}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">No sponsors yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first sponsor</p>
            <Button onClick={() => setIsFormOpen(true)} className="bg-rhino-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Sponsor
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <SponsorForm
          sponsor={editingSponsor}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Custom Delete Confirmation Dialog */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={sponsorToDelete?.name || ''}
        itemType="Sponsor"
        isLoading={deleteMutation.isPending}
        description={`Are you sure you want to delete "${sponsorToDelete?.name}"? This will remove the sponsor from all displays and cannot be undone.`}
      />
    </div>
  );
};

export default SponsorsManagement;
