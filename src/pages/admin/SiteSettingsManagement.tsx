import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Globe, 
  Phone, 
  Share2, 
  Palette, 
  Search,
  Info,
  CheckCircle,
  Shield,
  Smartphone,
  BarChart3,
  Zap,
  Users
} from 'lucide-react';
import SettingsCategory from '@/components/admin/settings/SettingsCategory';
import SettingField from '@/components/admin/settings/SettingField';
import ColorPickerField from '@/components/admin/settings/ColorPickerField';
import ToggleField from '@/components/admin/settings/ToggleField';
import FeatureToggleCard from '@/components/admin/settings/FeatureToggleCard';

const SiteSettingsManagement = () => {
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category, display_order, key');

      if (error) throw error;
      return data || [];
    },
  });

  const { data: featureToggles, isLoading: togglesLoading } = useQuery({
    queryKey: ['feature_toggles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_toggles')
        .select('*')
        .order('category, feature_key');

      if (error) throw error;
      return data || [];
    },
  });

  const getSettingValue = (key: string) => {
    return settings?.find(s => s.key === key)?.value || '';
  };

  const getSettingsByCategory = (category: string) => {
    return settings?.filter(s => s.category === category) || [];
  };

  const isSettingConfigured = (key: string) => {
    return Boolean(getSettingValue(key));
  };

  const getBooleanValue = (key: string) => {
    const value = getSettingValue(key);
    return value === 'true';
  };

  const configuredCount = settings?.filter(s => s.value).length || 0;
  const totalRecommended = settings?.length || 0;

  const groupedToggles = featureToggles?.reduce((acc, toggle) => {
    if (!acc[toggle.category]) {
      acc[toggle.category] = [];
    }
    acc[toggle.category].push(toggle);
    return acc;
  }, {} as Record<string, typeof featureToggles>) || {};

  if (settingsLoading || togglesLoading) {
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
          <h1 className="text-3xl font-bold text-slate-900">Advanced Site Settings</h1>
          <p className="text-slate-600">Configure your website's appearance, functionality, and integrations</p>
        </div>

        {/* Configuration Progress */}
        <Alert variant={configuredCount >= totalRecommended / 2 ? "success" : "info"}>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                Configuration Progress: {configuredCount} of {totalRecommended} settings configured
              </span>
              <div className="w-32 bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-rhino-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalRecommended > 0 ? (configuredCount / totalRecommended) * 100 : 0}%` }}
                />
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-10">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-1">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
          <TabsTrigger value="club" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Club</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Features</span>
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Comm</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-1">
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-1">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <SettingsCategory
            title="General Information"
            description="Basic website information and descriptions"
            icon={Globe}
          >
            <div className="space-y-6">
              {getSettingsByCategory('general').map((setting) => (
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

        {/* Visual & Branding */}
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

        {/* Club Information */}
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

        {/* Feature Toggles */}
        <TabsContent value="features">
          <SettingsCategory
            title="Feature Toggles"
            description="Enable or disable website features and modules"
            icon={Zap}
          >
            <div className="space-y-6">
              {Object.entries(groupedToggles).map(([category, toggles]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-semibold capitalize">
                    {category.replace(/_/g, ' ')} Features
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {toggles.map((toggle) => (
                      <FeatureToggleCard key={toggle.id} toggle={toggle} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SettingsCategory>
        </TabsContent>

        {/* Communication */}
        <TabsContent value="communication">
          <SettingsCategory
            title="Communication Settings"
            description="Email and notification configurations"
            icon={Phone}
          >
            <div className="space-y-6">
              {getSettingsByCategory('communication').map((setting) => {
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

        {/* Analytics */}
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

        {/* Security */}
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

        {/* Mobile */}
        <TabsContent value="mobile">
          <SettingsCategory
            title="Mobile Settings"
            description="Mobile app and responsive design options"
            icon={Smartphone}
          >
            <div className="space-y-6">
              {getSettingsByCategory('mobile').map((setting) => {
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

        {/* Social Media - keeping existing implementation */}
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

        {/* SEO - keeping existing implementation */}
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
      </Tabs>

      {/* Help Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="w-5 h-5" />
            Advanced Settings Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-blue-700">
            <p className="text-sm">
              • <strong>Visual & Branding:</strong> Customize colors, logos, and styling to match your club's identity
            </p>
            <p className="text-sm">
              • <strong>Feature Toggles:</strong> Enable/disable specific features based on your needs
            </p>
            <p className="text-sm">
              • <strong>Communication:</strong> Set up email servers and notification preferences
            </p>
            <p className="text-sm">
              • <strong>Security:</strong> Configure authentication and access control settings
            </p>
            <p className="text-sm">
              • <strong>Analytics:</strong> Track website performance and user engagement
            </p>
            <p className="text-sm">
              • All changes are saved automatically when you click Save
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsManagement;
