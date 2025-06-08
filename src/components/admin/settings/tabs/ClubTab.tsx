
import { TabsContent } from '@/components/ui/tabs';
import { Users } from 'lucide-react';
import SettingsCategory from '../SettingsCategory';
import SettingField from '../SettingField';

interface ClubTabProps {
  settings: any[];
}

const ClubTab = ({ settings }: ClubTabProps) => {
  const getSettingsByCategory = (category: string) => {
    return settings?.filter(s => s.category === category) || [];
  };

  return (
    <TabsContent value="club">
      <SettingsCategory
        title="Club Information"
        description="Details about your football club"
        icon={Users}
      >
        <div className="space-y-6">
          {getSettingsByCategory('club_info').map((setting) => (
            <SettingField
              key={setting.key}
              settingKey={setting.key}
              label={setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              description={setting.description || setting.help_text}
              currentValue={setting.value || ''}
              type={setting.setting_type as any}
              isConfigured={Boolean(setting.value)}
            />
          ))}
        </div>
      </SettingsCategory>
    </TabsContent>
  );
};

export default ClubTab;
