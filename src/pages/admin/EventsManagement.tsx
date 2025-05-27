
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
import { Calendar, Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

const EventsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const addEventMutation = useMutation({
    mutationFn: async (eventData: {
      title: string;
      description?: string;
      event_date: string;
      location?: string;
      event_type: string;
      is_public: boolean;
    }) => {
      const { error } = await supabase
        .from('events')
        .insert([eventData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsDialogOpen(false);
      setEditingEvent(null);
      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, ...eventData }: Partial<Event> & { id: string }) => {
      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsDialogOpen(false);
      setEditingEvent(null);
      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const eventData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      event_date: formData.get('event_date') as string,
      location: formData.get('location') as string || undefined,
      event_type: formData.get('event_type') as string,
      is_public: formData.get('is_public') === 'on',
    };

    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, ...eventData });
    } else {
      addEventMutation.mutate(eventData);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteEventMutation.mutate(id);
  };

  const upcomingEvents = events?.filter(e => new Date(e.event_date) > new Date()) || [];
  const pastEvents = events?.filter(e => new Date(e.event_date) <= new Date()) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Events Management</h1>
          <p className="text-slate-600">Manage club events and activities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-rhino-red to-red-700 hover:from-red-700 hover:to-red-800">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </DialogTitle>
                <DialogDescription>
                  Create or edit club events and activities.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingEvent?.title}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event_date">Event Date & Time</Label>
                  <Input
                    id="event_date"
                    name="event_date"
                    type="datetime-local"
                    defaultValue={editingEvent?.event_date ? 
                      format(new Date(editingEvent.event_date), "yyyy-MM-dd'T'HH:mm") 
                      : ''
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingEvent?.location || ''}
                    placeholder="Event venue or location"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event_type">Event Type</Label>
                  <Input
                    id="event_type"
                    name="event_type"
                    defaultValue={editingEvent?.event_type || 'other'}
                    placeholder="training, match, social, fundraiser, etc."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingEvent?.description || ''}
                    rows={3}
                    placeholder="Event details and information"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_public"
                    name="is_public"
                    defaultChecked={editingEvent?.is_public ?? true}
                  />
                  <Label htmlFor="is_public">Public event</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingEvent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addEventMutation.isPending || updateEventMutation.isPending}
                >
                  {editingEvent ? 'Update' : 'Create'} Event
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{upcomingEvents.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Past Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-600">{pastEvents.length}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{events?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Events
          </CardTitle>
          <CardDescription>
            Manage all club events and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : events && events.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{event.title}</p>
                        {event.description && (
                          <p className="text-sm text-slate-500 truncate max-w-xs">{event.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {format(new Date(event.event_date), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.location ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{event.location}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">No location</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.event_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={new Date(event.event_date) > new Date() ? 'default' : 'secondary'}>
                          {new Date(event.event_date) > new Date() ? 'Upcoming' : 'Past'}
                        </Badge>
                        {event.is_public && (
                          <Badge variant="outline" className="text-xs">Public</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
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
                              <AlertDialogTitle>Delete Event</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{event.title}"? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(event.id)}
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
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No events</h3>
              <p className="text-slate-600">Create your first event to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsManagement;
