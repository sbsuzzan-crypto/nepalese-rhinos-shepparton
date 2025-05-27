
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Save, Edit, Check, X, ExternalLink } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SettingFieldProps {
  settingKey: string;
  label: string;
  description?: string;
  currentValue?: string;
  type?: 'text' | 'textarea' | 'url' | 'email' | 'tel';
  placeholder?: string;
  isConfigured?: boolean;
}

const SettingField = ({
  settingKey,
  label,
  description,
  currentValue = '',
  type = 'text',
  placeholder,
  isConfigured = false
}: SettingFieldProps) => {
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

  const isUrl = type === 'url' && value;

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
            <Edit className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {type === 'textarea' ? (
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              rows={3}
            />
          ) : (
            <Input
              type={type}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
            />
          )}
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
          {value ? (
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-slate-700">
                {type === 'textarea' ? (
                  <div className="whitespace-pre-wrap">{value}</div>
                ) : (
                  value
                )}
              </span>
              {isUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a href={value} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          ) : (
            <span className="text-sm text-slate-500">Not configured</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingField;
