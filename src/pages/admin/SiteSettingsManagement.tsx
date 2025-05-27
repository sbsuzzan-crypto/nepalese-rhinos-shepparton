
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings, Plus, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type SiteSetting = Tables<'site_settings'>;

const SiteSettingsManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      return data;
    },
  });

  const createSettingMutation = useMutation({
    mutationFn: async (newSetting: Omit<SiteSetting, 'id' | 'updated_at'>) => {
      const { error } = await supabase
        .from('site_settings')
        .insert([newSetting]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({
        title: 'Success',
        description: 'Setting created successfully',
      });
      resetForm();
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SiteSetting> }) => {
      const { error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({
        title: 'Success',
        description: 'Setting updated successfully',
      });
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({ key: '', value: '', description: '' });
    setEditingSetting(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSetting) {
      updateSettingMutation.mutate({
        id: editingSetting.id,
        updates: formData,
      });
    } else {
      createSettingMutation.mutate(formData);
    }
  };

  const handleEdit = (setting: SiteSetting) => {
    setEditingSetting(setting);
    setFormData({
      key: setting.key,
      value: setting.value || '',
      description: setting.description || '',
    });
    setIsDialogOpen(true);
  };

  const commonSettings = [
    { key: 'facebook_url', description: 'Facebook page URL' },
    { key: 'instagram_url', description: 'Instagram profile URL' },
    { key: 'youtube_url', description: 'YouTube channel URL' },
    { key: 'contact_email', description: 'Main contact email address' },
    { key: 'contact_phone', description: 'Main contact phone number' },
    { key: 'club_address', description: 'Club physical address' },
    { key: 'club_description', description: 'Short club description for footer' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Site Settings</h1>
          <p className="text-slate-600">Manage website configuration and content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSetting(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSetting ? 'Edit Setting' : 'Add New Setting'}
              </DialogTitle>
              <DialogDescription>
                {editingSetting ? 'Update the setting details below.' : 'Create a new site setting.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="key">Setting Key</Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="e.g., facebook_url"
                  required
                  disabled={!!editingSetting}
                />
              </div>
              <div>
                <Label htmlFor="value">Value</Label>
                <Textarea
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Setting value"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this setting"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingSetting ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Setup for Common Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup</CardTitle>
          <CardDescription>
            Common settings to get your site configured quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonSettings.map((setting) => {
              const existingSetting = settings?.find(s => s.key === setting.key);
              return (
                <div key={setting.key} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{setting.key}</h4>
                      <p className="text-sm text-slate-600">{setting.description}</p>
                      {existingSetting && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Configured
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (existingSetting) {
                          handleEdit(existingSetting);
                        } else {
                          setFormData({
                            key: setting.key,
                            value: '',
                            description: setting.description,
                          });
                          setIsDialogOpen(true);
                        }
                      }}
                    >
                      {existingSetting ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* All Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            All Settings
          </CardTitle>
          <CardDescription>
            Manage all site configuration settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading settings...</div>
          ) : settings && settings.length > 0 ? (
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{setting.key}</h4>
                      {setting.description && (
                        <p className="text-sm text-slate-600 mb-2">{setting.description}</p>
                      )}
                      <div className="bg-slate-50 p-2 rounded text-sm font-mono">
                        {setting.value || 'No value set'}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(setting)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No settings configured</h3>
              <p className="text-slate-600">Start by adding your first site setting.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsManagement;
