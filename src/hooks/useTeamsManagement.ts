
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Team = Tables<'teams'>;

export const useTeamsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teams, isLoading } = useQuery({
    queryKey: ['admin-teams'],
    queryFn: async () => {
      console.log('Fetching teams...');
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }
      console.log('Teams fetched:', data);
      return data;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const addTeamMutation = useMutation({
    mutationFn: async (teamData: {
      name: string;
      description?: string;
      category?: string;
      is_active: boolean;
    }) => {
      console.log('Creating team:', teamData);
      const { error } = await supabase
        .from('teams')
        .insert([teamData]);

      if (error) {
        console.error('Create error:', error);
        throw error;
      }
      console.log('Team created successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
      queryClient.refetchQueries({ queryKey: ['admin-teams'] });
      
      setIsDialogOpen(false);
      setEditingTeam(null);
      toast({
        title: 'Success',
        description: 'Team created successfully',
      });
    },
    onError: (error: any) => {
      console.error('Create mutation error:', error);
      toast({
        title: 'Error',
        description: `Failed to create team: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, ...teamData }: Partial<Team> & { id: string }) => {
      console.log('Updating team:', id, teamData);
      const { error } = await supabase
        .from('teams')
        .update(teamData)
        .eq('id', id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      console.log('Team updated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
      queryClient.refetchQueries({ queryKey: ['admin-teams'] });
      
      setIsDialogOpen(false);
      setEditingTeam(null);
      toast({
        title: 'Success',
        description: 'Team updated successfully',
      });
    },
    onError: (error: any) => {
      console.error('Update mutation error:', error);
      toast({
        title: 'Error',
        description: `Failed to update team: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting team with ID:', id);
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      console.log('Team deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
      queryClient.refetchQueries({ queryKey: ['admin-teams'] });
      
      toast({
        title: 'Success',
        description: 'Team deleted successfully',
      });
      setDeleteDialogOpen(false);
      setTeamToDelete(null);
    },
    onError: (error: any) => {
      console.error('Delete mutation error:', error);
      toast({
        title: 'Error',
        description: `Failed to delete team: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    teams,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    editingTeam,
    setEditingTeam,
    deleteDialogOpen,
    setDeleteDialogOpen,
    teamToDelete,
    setTeamToDelete,
    addTeamMutation,
    updateTeamMutation,
    deleteTeamMutation,
  };
};
