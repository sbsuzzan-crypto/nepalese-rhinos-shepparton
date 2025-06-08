
import { TabsContent } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import SettingsCategory from '../SettingsCategory';
import SettingField from '../SettingField';
import ToggleField from '../ToggleField';

interface SecurityTabProps {
  settings: any[];
  getBooleanValue: (key: string) => boolean;
}

const SecurityTab = ({ settings, getBooleanValue }: SecurityTabProps) => {
  const getSettingsByCategory = (category: string) => {
    return settings?.filter(s => s.category === category) || [];
  };

  return (
    <TabsContent value="security">
      <SettingsCategory
        title="Security Settings"
        description="Configure security and authentication options"
        icon={Shield}
      >
        <div className="space-y-6">
          {getSettingsByCategory('security').map((setting) => {
            if (setting.setting_type === 'boolean') {
              return (
                <ToggleField
                  key={setting.key}
                  settingKey={setting.key}
                  label={setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  description={setting.description || setting.help_text}
                  currentValue={getBooleanValue(setting.key)}
                  isConfigured={Boolean(setting.value)}
                />
              );
            }
            return (
              <SettingField
                key={setting.key}
                settingKey={setting.key}
                label={setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                description={setting.description || setting.help_text}
                currentValue={setting.value || ''}
                type={setting.setting_type as any}
                isConfigured={Boolean(setting.value)}
              />
            );
          })}
        </div>
      </SettingsCategory>
    </TabsContent>
  );
};

export default SecurityTab;
