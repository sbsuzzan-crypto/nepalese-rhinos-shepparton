
import { TabsContent } from '@/components/ui/tabs';
import { BarChart3 } from 'lucide-react';
import SettingsCategory from '../SettingsCategory';
import SettingField from '../SettingField';

interface AnalyticsTabProps {
  settings: any[];
}

const AnalyticsTab = ({ settings }: AnalyticsTabProps) => {
  const getSettingsByCategory = (category: string) => {
    return settings?.filter(s => s.category === category) || [];
  };

  return (
    <TabsContent value="analytics">
      <SettingsCategory
        title="Analytics & Tracking"
        description="Configure website analytics and tracking"
        icon={BarChart3}
      >
        <div className="space-y-6">
          {getSettingsByCategory('analytics').map((setting) => (
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

export default AnalyticsTab;
