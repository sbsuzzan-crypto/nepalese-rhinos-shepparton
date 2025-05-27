
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import FileUpload from '@/components/admin/FileUpload';
import type { Database } from '@/integrations/supabase/types';

type Sponsor = Database['public']['Tables']['sponsors']['Row'];

interface SponsorFormProps {
  sponsor?: Sponsor | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SponsorForm = ({ sponsor, onClose, onSuccess }: SponsorFormProps) => {
  const [formData, setFormData] = useState({
    name: sponsor?.name || '',
    description: sponsor?.description || '',
    website_url: sponsor?.website_url || '',
    logo_url: sponsor?.logo_url || '',
    tier: sponsor?.tier || 'bronze',
    is_active: sponsor?.is_active ?? true,
  });

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (sponsor) {
        const { error } = await supabase
          .from('sponsors')
          .update(data)
          .eq('id', sponsor.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sponsors')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Sponsor ${sponsor ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to ${sponsor ? 'update' : 'create'} sponsor: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleFileUpload = (url: string) => {
    setFormData(prev => ({ ...prev, logo_url: url }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{sponsor ? 'Edit' : 'Add'} Sponsor</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="tier">Tier</Label>
              <Select value={formData.tier} onValueChange={(value) => setFormData(prev => ({ ...prev, tier: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Logo</Label>
            <FileUpload
              onUpload={handleFileUpload}
              accept="image/*"
              currentUrl={formData.logo_url}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-rhino-red hover:bg-red-700">
              {mutation.isPending ? 'Saving...' : sponsor ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SponsorForm;
