
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeatureToggle {
  id: string;
  feature_key: string;
  is_enabled: boolean;
  description: string;
  category: string;
}

interface FeatureToggleCardProps {
  toggle: FeatureToggle;
}

const FeatureToggleCard = ({ toggle }: FeatureToggleCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateToggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('feature_toggles')
        .update({ is_enabled: enabled })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature_toggles'] });
      toast({
        title: 'Success',
        description: 'Feature toggle updated successfully',
      });
    },
  });

  const handleToggle = (checked: boolean) => {
    updateToggleMutation.mutate({ id: toggle.id, enabled: checked });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      content: 'bg-blue-100 text-blue-800',
      communication: 'bg-green-100 text-green-800',
      user_interaction: 'bg-purple-100 text-purple-800',
      user_management: 'bg-orange-100 text-orange-800',
      mobile: 'bg-pink-100 text-pink-800',
      social: 'bg-cyan-100 text-cyan-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              {toggle.feature_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </CardTitle>
            <Badge className={`text-xs ${getCategoryColor(toggle.category)}`}>
              {toggle.category.replace(/_/g, ' ')}
            </Badge>
          </div>
          <Switch
            checked={toggle.is_enabled}
            onCheckedChange={handleToggle}
            disabled={updateToggleMutation.isPending}
          />
        </div>
        <CardDescription className="text-xs">
          {toggle.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default FeatureToggleCard;
