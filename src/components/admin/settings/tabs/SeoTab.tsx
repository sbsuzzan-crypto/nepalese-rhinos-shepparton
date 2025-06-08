
import { TabsContent } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import SettingsCategory from '../SettingsCategory';
import SettingField from '../SettingField';

interface SeoTabProps {
  getSettingValue: (key: string) => string;
  isSettingConfigured: (key: string) => boolean;
}

const SeoTab = ({ getSettingValue, isSettingConfigured }: SeoTabProps) => {
  return (
    <TabsContent value="seo">
      <SettingsCategory
        title="SEO & Meta Information"
        description="Improve your website's search engine visibility"
        icon={Search}
      >
        <div className="space-y-6">
          <SettingField
            settingKey="meta_keywords"
            label="Meta Keywords"
            description="Keywords for search engines (comma-separated)"
            currentValue={getSettingValue('meta_keywords')}
            placeholder="football, soccer, nepalese, rhinos, club, sports"
            isConfigured={isSettingConfigured('meta_keywords')}
          />
          <SettingField
            settingKey="google_analytics_id"
            label="Google Analytics ID"
            description="Your Google Analytics tracking ID"
            currentValue={getSettingValue('google_analytics_id')}
            placeholder="GA-XXXXXXXXX-X"
            isConfigured={isSettingConfigured('google_analytics_id')}
          />
        </div>
      </SettingsCategory>
    </TabsContent>
  );
};

export default SeoTab;
