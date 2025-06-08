
import { TabsContent } from '@/components/ui/tabs';
import { Share2 } from 'lucide-react';
import SettingsCategory from '../SettingsCategory';
import SettingField from '../SettingField';

interface SocialTabProps {
  getSettingValue: (key: string) => string;
  isSettingConfigured: (key: string) => boolean;
}

const SocialTab = ({ getSettingValue, isSettingConfigured }: SocialTabProps) => {
  return (
    <TabsContent value="social">
      <SettingsCategory
        title="Social Media Links"
        description="Connect your social media profiles"
        icon={Share2}
      >
        <div className="space-y-6">
          <SettingField
            settingKey="facebook_url"
            label="Facebook Page"
            description="Link to your Facebook page"
            currentValue={getSettingValue('facebook_url')}
            type="url"
            placeholder="https://facebook.com/nepaleserhinos"
            isConfigured={isSettingConfigured('facebook_url')}
          />
          <SettingField
            settingKey="instagram_url"
            label="Instagram Profile"
            description="Link to your Instagram profile"
            currentValue={getSettingValue('instagram_url')}
            type="url"
            placeholder="https://instagram.com/nepaleserhinos"
            isConfigured={isSettingConfigured('instagram_url')}
          />
          <SettingField
            settingKey="youtube_url"
            label="YouTube Channel"
            description="Link to your YouTube channel"
            currentValue={getSettingValue('youtube_url')}
            type="url"
            placeholder="https://youtube.com/@nepaleserhinos"
            isConfigured={isSettingConfigured('youtube_url')}
          />
          <SettingField
            settingKey="twitter_url"
            label="Twitter/X Profile"
            description="Link to your Twitter/X profile"
            currentValue={getSettingValue('twitter_url')}
            type="url"
            placeholder="https://twitter.com/nepaleserhinos"
            isConfigured={isSettingConfigured('twitter_url')}
          />
        </div>
      </SettingsCategory>
    </TabsContent>
  );
};

export default SocialTab;
