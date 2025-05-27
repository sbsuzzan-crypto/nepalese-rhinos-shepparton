
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Globe, 
  Phone, 
  Share2, 
  Palette, 
  Search,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import SettingsCategory from '@/components/admin/settings/SettingsCategory';
import SettingField from '@/components/admin/settings/SettingField';

const SiteSettingsManagement = () => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      return data || [];
    },
  });

  const getSettingValue = (key: string) => {
    return settings?.find(s => s.key === key)?.value || '';
  };

  const isSettingConfigured = (key: string) => {
    return Boolean(getSettingValue(key));
  };

  const configuredCount = settings?.filter(s => s.value).length || 0;
  const totalRecommended = 12; // Number of recommended settings

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Site Settings</h1>
          <p className="text-slate-600">Configure your website's core information and branding</p>
        </div>

        {/* Configuration Progress */}
        <Alert variant={configuredCount >= totalRecommended / 2 ? "success" : "info"}>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                Configuration Progress: {configuredCount} of {totalRecommended} recommended settings
              </span>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-rhino-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(configuredCount / totalRecommended) * 100}%` }}
                />
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      {/* Settings Categories */}
      <div className="grid gap-6">
        {/* General Information */}
        <SettingsCategory
          title="General Information"
          description="Basic website information and descriptions"
          icon={Globe}
        >
          <div className="space-y-6">
            <SettingField
              settingKey="site_name"
              label="Site Name"
              description="The name of your football club website"
              currentValue={getSettingValue('site_name')}
              placeholder="Nepalese Rhinos FC"
              isConfigured={isSettingConfigured('site_name')}
            />
            <SettingField
              settingKey="site_description"
              label="Site Description"
              description="A brief description of your club for SEO and social sharing"
              currentValue={getSettingValue('site_description')}
              type="textarea"
              placeholder="Official website of Nepalese Rhinos Football Club..."
              isConfigured={isSettingConfigured('site_description')}
            />
            <SettingField
              settingKey="club_description"
              label="Club Description"
              description="Short description displayed in the footer"
              currentValue={getSettingValue('club_description')}
              type="textarea"
              placeholder="A passionate football club representing the Nepalese community..."
              isConfigured={isSettingConfigured('club_description')}
            />
          </div>
        </SettingsCategory>

        {/* Contact Information */}
        <SettingsCategory
          title="Contact Information"
          description="How supporters and partners can reach you"
          icon={Phone}
        >
          <div className="space-y-6">
            <SettingField
              settingKey="contact_email"
              label="Contact Email"
              description="Main email address for inquiries"
              currentValue={getSettingValue('contact_email')}
              type="email"
              placeholder="info@nepaleserhinos.com"
              isConfigured={isSettingConfigured('contact_email')}
            />
            <SettingField
              settingKey="contact_phone"
              label="Contact Phone"
              description="Main phone number for the club"
              currentValue={getSettingValue('contact_phone')}
              type="tel"
              placeholder="+1 (555) 123-4567"
              isConfigured={isSettingConfigured('contact_phone')}
            />
            <SettingField
              settingKey="club_address"
              label="Club Address"
              description="Physical address of the club"
              currentValue={getSettingValue('club_address')}
              type="textarea"
              placeholder="123 Football Lane, Sports City, SC 12345"
              isConfigured={isSettingConfigured('club_address')}
            />
            <SettingField
              settingKey="business_hours"
              label="Business Hours"
              description="When the club office is open"
              currentValue={getSettingValue('business_hours')}
              placeholder="Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
              isConfigured={isSettingConfigured('business_hours')}
            />
          </div>
        </SettingsCategory>

        {/* Social Media */}
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

        {/* SEO & Meta */}
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
      </div>

      {/* Help Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="w-5 h-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-blue-700">
            <p className="text-sm">
              • Configure at least the basic contact information and social media links
            </p>
            <p className="text-sm">
              • SEO settings help your website appear better in search results
            </p>
            <p className="text-sm">
              • All changes are saved automatically when you click Save
            </p>
            <p className="text-sm">
              • Settings marked as "Configured" are already set up and active
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsManagement;
