
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Team = Tables<'teams'> & {
  players?: { count: number }[];
};

export const useTeamsManagement = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      console.log('Fetching teams with player counts...');
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          players (count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }
      
      console.log('Teams fetched successfully:', data);
      return data as Team[];
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: async (teamData: Omit<Team, 'id' | 'created_at' | 'updated_at' | 'players'>) => {
      console.log('Creating team:', teamData);
      const { data, error } = await supabase
        .from('teams')
        .insert([teamData])
        .select()
        .single();

      if (error) {
        console.error('Error creating team:', error);
        throw error;
      }

      console.log('Team created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setFormDialogOpen(false);
      setEditingTeam(null);
      toast({
        title: 'Success',
        description: 'Team created successfully',
      });
    },
    onError: (error: any) => {
      console.error('Create team error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create team',
        variant: 'destructive',
      });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Team> & { id: string }) => {
      console.log('Updating team:', id, updates);
      const { data, error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating team:', error);
        throw error;
      }

      console.log('Team updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setFormDialogOpen(false);
      setEditingTeam(null);
      toast({
        title: 'Success',
        description: 'Team updated successfully',
      });
    },
    onError: (error: any) => {
      console.error('Update team error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update team',
        variant: 'destructive',
      });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting team:', id);
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting team:', error);
        throw error;
      }

      console.log('Team deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['players'] }); // Refresh players as well
      setDeleteDialogOpen(false);
      setTeamToDelete(null);
      toast({
        title: 'Success',
        description: 'Team deleted successfully',
      });
    },
    onError: (error: any) => {
      console.error('Delete team error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete team',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const teamData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string || null,
      description: formData.get('description') as string || null,
      is_active: formData.get('is_active') === 'on',
    };

    if (editingTeam) {
      updateTeamMutation.mutate({ id: editingTeam.id, ...teamData });
    } else {
      createTeamMutation.mutate(teamData);
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormDialogOpen(true);
  };

  const handleDelete = (team: Team) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (teamToDelete) {
      deleteTeamMutation.mutate(teamToDelete.id);
    }
  };

  const handleCancel = () => {
    setFormDialogOpen(false);
    setEditingTeam(null);
  };

  const handleAddNew = () => {
    setEditingTeam(null);
    setFormDialogOpen(true);
  };

  return {
    teams,
    isLoading,
    editingTeam,
    formDialogOpen,
    deleteDialogOpen,
    teamToDelete,
    setFormDialogOpen,
    setDeleteDialogOpen,
    isCreating: createTeamMutation.isPending,
    isUpdating: updateTeamMutation.isPending,
    isDeleting: deleteTeamMutation.isPending,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    handleAddNew,
    confirmDelete,
  };
};
