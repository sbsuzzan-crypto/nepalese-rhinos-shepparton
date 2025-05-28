
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Edit, Plus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Fixture {
  id: string;
  opponent: string;
  venue: string;
  match_date: string;
  is_home: boolean;
  status: "upcoming" | "live" | "completed" | "cancelled" | "postponed";
  home_score: number | null;
  away_score: number | null;
  match_report: string | null;
}

const FixturesManagement = () => {
  const { isAdmin, isModerator } = useAuth();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    opponent: '',
    venue: '',
    match_date: '',
    is_home: true,
    status: 'upcoming' as "upcoming" | "live" | "completed" | "cancelled" | "postponed",
    home_score: '',
    away_score: '',
    match_report: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin || isModerator) {
      fetchFixtures();
    }
  }, [isAdmin, isModerator]);

  const fetchFixtures = async () => {
    try {
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .order('match_date', { ascending: false });

      if (error) throw error;
      setFixtures(data || []);
    } catch (error: any) {
      console.error('Error fetching fixtures:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fixtures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const fixtureData = {
        opponent: formData.opponent,
        venue: formData.venue,
        match_date: new Date(formData.match_date).toISOString(),
        is_home: formData.is_home,
        status: formData.status,
        home_score: formData.home_score ? parseInt(formData.home_score) : null,
        away_score: formData.away_score ? parseInt(formData.away_score) : null,
        match_report: formData.match_report || null
      };

      if (editingFixture) {
        const { error } = await supabase
          .from('fixtures')
          .update(fixtureData)
          .eq('id', editingFixture.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Fixture updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('fixtures')
          .insert([fixtureData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Fixture created successfully",
        });
      }

      resetForm();
      fetchFixtures();
    } catch (error: any) {
      console.error('Error saving fixture:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save fixture",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setFormData({
      opponent: fixture.opponent,
      venue: fixture.venue,
      match_date: format(new Date(fixture.match_date), "yyyy-MM-dd'T'HH:mm"),
      is_home: fixture.is_home,
      status: fixture.status,
      home_score: fixture.home_score?.toString() || '',
      away_score: fixture.away_score?.toString() || '',
      match_report: fixture.match_report || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fixture?')) return;

    try {
      const { error } = await supabase
        .from('fixtures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Fixture deleted successfully",
      });
      fetchFixtures();
    } catch (error: any) {
      console.error('Error deleting fixture:', error);
      toast({
        title: "Error",
        description: "Failed to delete fixture",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      opponent: '',
      venue: '',
      match_date: '',
      is_home: true,
      status: 'upcoming',
      home_score: '',
      away_score: '',
      match_report: ''
    });
    setEditingFixture(null);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'live': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      case 'postponed': return 'bg-orange-500';
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
          <h1 className="text-3xl font-bold">Fixtures Management</h1>
          <p className="text-gray-600">Manage team fixtures and match results</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-rhino-red hover:bg-red-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Fixture
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingFixture ? 'Edit Fixture' : 'Add New Fixture'}
            </CardTitle>
            <CardDescription>
              Fill out the form below to {editingFixture ? 'update' : 'add'} a fixture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="opponent">Opponent</Label>
                  <Input
                    id="opponent"
                    value={formData.opponent}
                    onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="match_date">Match Date & Time</Label>
                  <Input
                    id="match_date"
                    type="datetime-local"
                    value={formData.match_date}
                    onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as "upcoming" | "live" | "completed" | "cancelled" | "postponed" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="postponed">Postponed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_home"
                    checked={formData.is_home}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_home: checked })}
                  />
                  <Label htmlFor="is_home">Home Match</Label>
                </div>

                {formData.status === 'completed' && (
                  <>
                    <div>
                      <Label htmlFor="home_score">Home Score</Label>
                      <Input
                        id="home_score"
                        type="number"
                        min="0"
                        value={formData.home_score}
                        onChange={(e) => setFormData({ ...formData, home_score: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="away_score">Away Score</Label>
                      <Input
                        id="away_score"
                        type="number"
                        min="0"
                        value={formData.away_score}
                        onChange={(e) => setFormData({ ...formData, away_score: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>

              {formData.status === 'completed' && (
                <div>
                  <Label htmlFor="match_report">Match Report</Label>
                  <textarea
                    id="match_report"
                    value={formData.match_report}
                    onChange={(e) => setFormData({ ...formData, match_report: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" className="bg-rhino-blue hover:bg-blue-700">
                  {editingFixture ? 'Update' : 'Add'} Fixture
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {fixtures.map((fixture) => (
          <Card key={fixture.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    Nepalese Rhinos FC vs {fixture.opponent}
                    <Badge className={`${getStatusColor(fixture.status)} text-white`}>
                      {fixture.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(fixture.match_date), 'PPP p')} • {fixture.venue} ({fixture.is_home ? 'Home' : 'Away'})
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(fixture)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(fixture.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {fixture.status === 'completed' && fixture.home_score !== null && fixture.away_score !== null && (
                <div className="mb-4">
                  <p className="text-lg font-semibold">
                    Final Score: {fixture.is_home ? fixture.home_score : fixture.away_score} - {fixture.is_home ? fixture.away_score : fixture.home_score}
                  </p>
                </div>
              )}
              {fixture.match_report && (
                <p className="text-sm text-gray-600">{fixture.match_report}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {fixtures.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No fixtures</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first fixture</p>
            <Button onClick={() => setShowForm(true)} className="bg-rhino-red hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Fixture
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FixturesManagement;
