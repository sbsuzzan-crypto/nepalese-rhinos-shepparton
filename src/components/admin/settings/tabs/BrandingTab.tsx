
import { TabsContent } from '@/components/ui/tabs';
import { Palette } from 'lucide-react';
import SettingsCategory from '../SettingsCategory';
import SettingField from '../SettingField';
import ColorPickerField from '../ColorPickerField';

interface BrandingTabProps {
  settings: any[];
}

const BrandingTab = ({ settings }: BrandingTabProps) => {
  const getSettingsByCategory = (category: string) => {
    return settings?.filter(s => s.category === category) || [];
  };

  return (
    <TabsContent value="branding">
      <SettingsCategory
        title="Visual & Branding"
        description="Customize your website's appearance and brand identity"
        icon={Palette}
      >
        <div className="space-y-6">
          {getSettingsByCategory('visual_branding').map((setting) => {
            if (setting.setting_type === 'color') {
              return (
                <ColorPickerField
                  key={setting.key}
                  settingKey={setting.key}
                  label={setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  description={setting.description || setting.help_text}
                  currentValue={setting.value || '#3B82F6'}
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

export default BrandingTab;
