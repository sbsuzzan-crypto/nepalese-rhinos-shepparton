
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Edit, Plus, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/admin/FileUpload';
import CustomDeleteDialog from '@/components/admin/CustomDeleteDialog';
import SearchInput from '@/components/admin/SearchInput';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface Player {
  id: string;
  name: string;
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  jersey_number: number | null;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean;
  team_id: string | null;
  created_at: string;
}

interface Team {
  id: string;
  name: string;
  is_active: boolean;
}

const PlayersManagement = () => {
  const { isAdmin, isModerator } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [formData, setFormData] = useState({
    name: '',
    position: 'forward' as 'goalkeeper' | 'defender' | 'midfielder' | 'forward',
    jersey_number: '',
    bio: '',
    photo_url: '',
    team_id: '',
    is_active: true
  });
  const { toast } = useToast();

  // Filter and paginate players
  const filteredPlayers = useMemo(() => {
    return players.filter(player => 
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (player.jersey_number && player.jersey_number.toString().includes(searchQuery))
    );
  }, [players, searchQuery]);

  const paginatedPlayers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPlayers.slice(startIndex, startIndex + pageSize);
  }, [filteredPlayers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPlayers.length / pageSize);

  useEffect(() => {
    if (isAdmin || isModerator) {
      fetchPlayers();
      fetchTeams();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('players-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'players'
          },
          (payload) => {
            console.log('Players realtime update:', payload);
            fetchPlayers();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin, isModerator]);

  const fetchPlayers = async () => {
    try {
      console.log('Fetching players...');
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('jersey_number', { ascending: true });

      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }
      console.log('Players fetched:', data);
      setPlayers(data || []);
    } catch (error: any) {
      console.error('Error fetching players:', error);
      toast({
        title: "Error",
        description: "Failed to fetch players",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, is_active')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setTeams(data || []);
    } catch (error: any) {
      console.error('Error fetching teams:', error);
    }
  };

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return 'No Team';
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const playerData = {
        name: formData.name,
        position: formData.position,
        jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null,
        bio: formData.bio || null,
        photo_url: formData.photo_url || null,
        team_id: formData.team_id || null,
        is_active: formData.is_active
      };

      if (editingPlayer) {
        console.log('Updating player:', editingPlayer.id);
        const { error } = await supabase
          .from('players')
          .update(playerData)
          .eq('id', editingPlayer.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Player updated successfully",
        });
      } else {
        console.log('Creating new player');
        const { error } = await supabase
          .from('players')
          .insert([playerData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Player created successfully",
        });
      }

      resetForm();
      fetchPlayers();
    } catch (error: any) {
      console.error('Error saving player:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save player",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      position: player.position,
      jersey_number: player.jersey_number?.toString() || '',
      bio: player.bio || '',
      photo_url: player.photo_url || '',
      team_id: player.team_id || '',
      is_active: player.is_active
    });
    setShowForm(true);
  };

  const handleDelete = (player: Player) => {
    setPlayerToDelete(player);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!playerToDelete) return;

    try {
      console.log('Deleting player:', playerToDelete.id);
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerToDelete.id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('Player deleted successfully');
      toast({
        title: "Success",
        description: "Player deleted successfully",
      });
      fetchPlayers();
    } catch (error: any) {
      console.error('Error deleting player:', error);
      toast({
        title: "Error",
        description: "Failed to delete player",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPlayerToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: 'forward',
      jersey_number: '',
      bio: '',
      photo_url: '',
      team_id: '',
      is_active: true
    });
    setEditingPlayer(null);
    setShowForm(false);
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'goalkeeper': return 'bg-yellow-500';
      case 'defender': return 'bg-blue-500';
      case 'midfielder': return 'bg-green-500';
      case 'forward': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isAdmin && !isModerator) {
    return (
      <Alert>
        <AlertDescription>
          You don't have permission to access this page.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-rhino-red border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Loading players...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Players Management</h1>
          <p className="text-gray-600">Manage team players and their information</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-rhino-red hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Player
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search players by name, position, or jersey number..."
          className="w-full sm:w-96"
        />
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Total: {players.length}</span>
          <span>Active: {players.filter(p => p.is_active).length}</span>
          <span>Showing: {filteredPlayers.length}</span>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">
              {editingPlayer ? 'Edit Player' : 'Add New Player'}
            </CardTitle>
            <CardDescription>
              Fill out the form below to {editingPlayer ? 'update' : 'add'} a player
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="text-gray-900"
                  />
                </div>

                <div>
                  <Label htmlFor="jersey_number" className="text-gray-700">Jersey Number</Label>
                  <Input
                    id="jersey_number"
                    type="number"
                    min="1"
                    max="99"
                    value={formData.jersey_number}
                    onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
                    className="text-gray-900"
                  />
                </div>

                <div>
                  <Label htmlFor="position" className="text-gray-700">Position</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value as 'goalkeeper' | 'defender' | 'midfielder' | 'forward' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                      <SelectItem value="defender">Defender</SelectItem>
                      <SelectItem value="midfielder">Midfielder</SelectItem>
                      <SelectItem value="forward">Forward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="team_id" className="text-gray-700">Team</Label>
                  <Select
                    value={formData.team_id}
                    onValueChange={(value) => setFormData({ ...formData, team_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Team</SelectItem>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active" className="text-gray-700">Active Player</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="text-gray-900"
                />
              </div>

              <div>
                <Label className="text-gray-700">Player Photo</Label>
                <FileUpload
                  onUpload={(url) => setFormData({ ...formData, photo_url: url })}
                  accept="image/*"
                  fileType="image"
                  existingUrl={formData.photo_url}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-rhino-blue hover:bg-blue-700">
                  {editingPlayer ? 'Update' : 'Add'} Player
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPlayers.map((player) => (
          <Card key={player.id} className={!player.is_active ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    {player.name}
                    {player.jersey_number && (
                      <Badge variant="outline">#{player.jersey_number}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${getPositionColor(player.position)} text-white`}>
                      {player.position}
                    </Badge>
                    <Badge variant="secondary">
                      {getTeamName(player.team_id)}
                    </Badge>
                    {!player.is_active && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(player)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(player)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {player.photo_url && (
                <img
                  src={player.photo_url}
                  alt={player.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              {player.bio && (
                <p className="text-sm text-gray-600 line-clamp-3">{player.bio}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
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
        </div>
      )}

      {filteredPlayers.length === 0 && searchQuery && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">No players found</h3>
            <p className="text-gray-600 mb-4">No players match your search criteria</p>
            <Button onClick={() => setSearchQuery('')} variant="outline">
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}

      {players.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900">No players</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first player</p>
            <Button onClick={() => setShowForm(true)} className="bg-rhino-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Custom Delete Confirmation Dialog */}
      <CustomDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={playerToDelete?.name || ''}
        itemType="Player"
        isLoading={false}
        description={`Are you sure you want to delete "${playerToDelete?.name}"? This will permanently remove the player from the system.`}
      />
    </div>
  );
};

export default PlayersManagement;
