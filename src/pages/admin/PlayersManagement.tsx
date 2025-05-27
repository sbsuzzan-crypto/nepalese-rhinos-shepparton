import { useState, useEffect } from 'react';
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

interface Player {
  id: string;
  name: string;
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  jersey_number: number | null;
  bio: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
}

const PlayersManagement = () => {
  const { isAdmin, isModerator } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: 'forward' as 'goalkeeper' | 'defender' | 'midfielder' | 'forward',
    jersey_number: '',
    bio: '',
    photo_url: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin || isModerator) {
      fetchPlayers();
    }
  }, [isAdmin, isModerator]);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('jersey_number', { ascending: true });

      if (error) throw error;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const playerData = {
        name: formData.name,
        position: formData.position,
        jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null,
        bio: formData.bio || null,
        photo_url: formData.photo_url || null,
        is_active: formData.is_active
      };

      if (editingPlayer) {
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
      is_active: player.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: 'forward',
      jersey_number: '',
      bio: '',
      photo_url: '',
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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Players Management</h1>
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

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="jersey_number">Jersey Number</Label>
                  <Input
                    id="jersey_number"
                    type="number"
                    min="1"
                    max="99"
                    value={formData.jersey_number}
                    onChange={(e) => setFormData({ ...formData, jersey_number: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="position">Position</Label>
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active Player</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label>Player Photo</Label>
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
        {players.map((player) => (
          <Card key={player.id} className={!player.is_active ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {player.name}
                    {player.jersey_number && (
                      <Badge variant="outline">#{player.jersey_number}</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge className={`${getPositionColor(player.position)} text-white`}>
                      {player.position}
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
                    onClick={() => handleDelete(player.id)}
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

      {players.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No players</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first player</p>
            <Button onClick={() => setShowForm(true)} className="bg-rhino-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayersManagement;
