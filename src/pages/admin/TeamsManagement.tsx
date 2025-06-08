
import { useTeamsManagement } from '@/hooks/useTeamsManagement';
import { TeamForm } from '@/components/admin/teams/TeamForm';
import { TeamsStats } from '@/components/admin/teams/TeamsStats';
import { TeamsTable } from '@/components/admin/teams/TeamsTable';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';

const TeamsManagement = () => {
  const {
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
  } = useTeamsManagement();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const teamData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      category: formData.get('category') as string || undefined,
      is_active: formData.get('is_active') === 'on',
    };

    if (editingTeam) {
      updateTeamMutation.mutate({ id: editingTeam.id, ...teamData });
    } else {
      addTeamMutation.mutate(teamData);
    }
  };

  const handleEdit = (team: any) => {
    setEditingTeam(team);
    setIsDialogOpen(true);
  };

  const handleDelete = (team: any) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingTeam(null);
  };

  const confirmDelete = () => {
    if (teamToDelete) {
      deleteTeamMutation.mutate(teamToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teams Management</h1>
          <p className="text-slate-600">Manage club teams and squads</p>
        </div>
        <TeamForm
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          editingTeam={editingTeam}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={addTeamMutation.isPending || updateTeamMutation.isPending}
        />
      </div>

      <TeamsStats teams={teams} />

      <TeamsTable
        teams={teams}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={teamToDelete?.name || ''}
        itemType="Team"
        isLoading={deleteTeamMutation.isPending}
        description={`Are you sure you want to delete "${teamToDelete?.name}"? This will remove the team from the system and cannot be undone.`}
      />
    </div>
  );
};

export default TeamsManagement;
