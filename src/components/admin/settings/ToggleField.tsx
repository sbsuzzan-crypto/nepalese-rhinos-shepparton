
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ToggleFieldProps {
  settingKey: string;
  label: string;
  description?: string;
  currentValue?: boolean;
  isConfigured?: boolean;
}

const ToggleField = ({
  settingKey,
  label,
  description,
  currentValue = false,
  isConfigured = false
}: ToggleFieldProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, newValue }: { key: string; newValue: string }) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key, 
          value: newValue,
          description: description || ''
        }, {
          onConflict: 'key'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({
        title: 'Success',
        description: `${label} updated successfully`,
      });
    },
  });

  const handleToggle = (checked: boolean) => {
    updateSettingMutation.mutate({ key: settingKey, newValue: checked.toString() });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label className="font-medium">{label}</Label>
            {isConfigured && (
              <Badge variant="success" className="text-xs">
                Configured
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          )}
        </div>
        <Switch
          checked={currentValue}
          onCheckedChange={handleToggle}
          disabled={updateSettingMutation.isPending}
        />
      </div>
    </div>
  );
};

export default ToggleField;
