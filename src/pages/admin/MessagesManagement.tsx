
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Mail, Users, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
type JoinSubmission = Database['public']['Tables']['join_submissions']['Row'];

const MessagesManagement = () => {
  const [selectedTab, setSelectedTab] = useState('contact');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contactMessages, isLoading: loadingContact } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  const { data: joinSubmissions, isLoading: loadingJoin } = useQuery({
    queryKey: ['join-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('join_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as JoinSubmission[];
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async ({ id, table }: { id: string; table: string }) => {
      const { error } = await supabase
        .from(table)
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      queryClient.invalidateQueries({ queryKey: ['join-submissions'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, table }: { id: string; table: string }) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      queryClient.invalidateQueries({ queryKey: ['join-submissions'] });
      toast({
        title: 'Success',
        description: 'Message deleted successfully',
      });
    },
  });

  const handleMarkAsRead = (id: string, table: string) => {
    markAsReadMutation.mutate({ id, table });
  };

  const handleDelete = (id: string, table: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate({ id, table });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages Management</h1>
        <p className="text-gray-600">Manage contact messages and join requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactMessages?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Join Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{joinSubmissions?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {contactMessages?.filter(m => !m.is_read).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Joins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {joinSubmissions?.filter(j => j.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Messages
          </TabsTrigger>
          <TabsTrigger value="join" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Join Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          {loadingContact ? (
            <div className="text-center py-8">Loading contact messages...</div>
          ) : contactMessages && contactMessages.length > 0 ? (
            <div className="space-y-4">
              {contactMessages.map((message) => (
                <Card key={message.id} className={message.is_read ? 'opacity-75' : ''}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{message.subject || 'No Subject'}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">{message.name}</span>
                          <Badge variant="outline">{message.email}</Badge>
                          <Badge variant={message.is_read ? 'secondary' : 'destructive'}>
                            {message.is_read ? 'Read' : 'Unread'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!message.is_read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(message.id, 'contact_messages')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(message.id, 'contact_messages')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">{message.message}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(message.created_at!), 'PPpp')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No contact messages</h3>
                <p className="text-gray-600">Messages will appear here when users contact you</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="join" className="space-y-4">
          {loadingJoin ? (
            <div className="text-center py-8">Loading join requests...</div>
          ) : joinSubmissions && joinSubmissions.length > 0 ? (
            <div className="space-y-4">
              {joinSubmissions.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{submission.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{submission.email}</Badge>
                          <Badge variant="outline">{submission.position_interest}</Badge>
                          <Badge 
                            variant={submission.status === 'pending' ? 'destructive' : 'secondary'}
                          >
                            {submission.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(submission.id, 'join_submissions')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {submission.phone && (
                        <div>
                          <span className="text-sm font-medium">Phone:</span>
                          <p className="text-sm text-gray-600">{submission.phone}</p>
                        </div>
                      )}
                      {submission.experience_level && (
                        <div>
                          <span className="text-sm font-medium">Experience:</span>
                          <p className="text-sm text-gray-600">{submission.experience_level}</p>
                        </div>
                      )}
                    </div>
                    {submission.message && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Message:</span>
                        <p className="text-sm text-gray-700 mt-1">{submission.message}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      {format(new Date(submission.created_at!), 'PPpp')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No join requests</h3>
                <p className="text-gray-600">Join requests will appear here when users apply</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesManagement;
