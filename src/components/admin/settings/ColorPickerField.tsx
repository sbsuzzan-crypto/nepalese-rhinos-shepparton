
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Palette, Check, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ColorPickerFieldProps {
  settingKey: string;
  label: string;
  description?: string;
  currentValue?: string;
  isConfigured?: boolean;
}

const ColorPickerField = ({
  settingKey,
  label,
  description,
  currentValue = '#3B82F6',
  isConfigured = false
}: ColorPickerFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentValue);
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
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    updateSettingMutation.mutate({ key: settingKey, newValue: value });
  };

  const handleCancel = () => {
    setValue(currentValue);
    setIsEditing(false);
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
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Palette className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
            />
            <Input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="#3B82F6"
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateSettingMutation.isPending}
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded border border-slate-300"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm font-mono text-slate-700">{value}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPickerField;
