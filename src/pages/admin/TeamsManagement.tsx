
import { useTeamsManagement } from '@/hooks/useTeamsManagement';
import { TeamForm } from '@/components/admin/teams/TeamForm';
import { TeamsStats } from '@/components/admin/teams/TeamsStats';
import { TeamsTable } from '@/components/admin/teams/TeamsTable';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
import SearchInput from '@/components/admin/SearchInput';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

const TeamsManagement = () => {
  const {
    teams,
    isLoading,
    editingTeam,
    formDialogOpen,
    deleteDialogOpen,
    teamToDelete,
    setFormDialogOpen,
    setDeleteDialogOpen,
    isCreating,
    isUpdating,
    isDeleting,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancel,
    handleAddNew,
    confirmDelete,
  } = useTeamsManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter teams based on search term
  const filteredTeams = teams?.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teams Management</h1>
          <p className="text-slate-600">Manage club teams and squads</p>
        </div>
        <TeamForm
          isOpen={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          editingTeam={editingTeam}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isCreating || isUpdating}
        />
      </div>

      <TeamsStats teams={teams} />

      {/* Search and Results Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search teams..."
          className="w-full sm:w-80"
        />
        <div className="text-sm text-slate-600">
          Showing {paginatedTeams.length} of {filteredTeams.length} teams
        </div>
      </div>

      <TeamsTable
        teams={paginatedTeams}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={teamToDelete?.name || ''}
        itemType="Team"
        isLoading={isDeleting}
        description={`Are you sure you want to delete "${teamToDelete?.name}"? This will remove the team from the system and cannot be undone.`}
      />
    </div>
  );
};

export default TeamsManagement;
