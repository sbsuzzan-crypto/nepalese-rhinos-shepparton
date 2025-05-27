
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Users, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Team = Tables<'teams'>;

const TeamsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addTeamMutation = useMutation({
    mutationFn: async (teamData: {
      name: string;
      description?: string;
      category?: string;
      is_active: boolean;
    }) => {
      const { error } = await supabase
        .from('teams')
        .insert([teamData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsDialogOpen(false);
      setEditingTeam(null);
      toast({
        title: 'Success',
        description: 'Team created successfully',
      });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, ...teamData }: Partial<Team> & { id: string }) => {
      const { error } = await supabase
        .from('teams')
        .update(teamData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setIsDialogOpen(false);
      setEditingTeam(null);
      toast({
        title: 'Success',
        description: 'Team updated successfully',
      });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast({
        title: 'Success',
        description: 'Team deleted successfully',
      });
    },
  });

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

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTeamMutation.mutate(id);
  };

  const activeTeams = teams?.filter(t => t.is_active) || [];
  const inactiveTeams = teams?.filter(t => !t.is_active) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teams Management</h1>
          <p className="text-slate-600">Manage club teams and squads</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-rhino-red to-red-700 hover:from-red-700 hover:to-red-800">
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingTeam ? 'Edit Team' : 'Add New Team'}
                </DialogTitle>
                <DialogDescription>
                  Create or edit teams for the club.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingTeam?.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={editingTeam?.category || ''}
                    placeholder="e.g., Senior, Youth, Women's"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingTeam?.description || ''}
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    name="is_active"
                    defaultChecked={editingTeam?.is_active ?? true}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingTeam(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addTeamMutation.isPending || updateTeamMutation.isPending}
                >
                  {editingTeam ? 'Update' : 'Create'} Team
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
            <CardTitle className="text-sm font-medium text-slate-600">Active Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeTeams.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Inactive Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{inactiveTeams.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{teams?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Teams
          </CardTitle>
          <CardDescription>
            Manage all club teams and squads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading teams...</div>
          ) : teams && teams.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{team.name}</p>
                        {team.description && (
                          <p className="text-sm text-slate-500 truncate max-w-xs">{team.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {team.category && (
                        <Badge variant="outline">{team.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={team.is_active ? 'default' : 'secondary'}>
                        {team.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {team.created_at ? format(new Date(team.created_at), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(team)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Team</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{team.name}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(team.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No teams</h3>
              <p className="text-slate-600">Create your first team to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsManagement;
