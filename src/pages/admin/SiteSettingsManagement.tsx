
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs } from '@/components/ui/tabs';
import SettingsProgress from '@/components/admin/settings/SettingsProgress';
import SettingsTabsList from '@/components/admin/settings/SettingsTabsList';
import GeneralTab from '@/components/admin/settings/tabs/GeneralTab';
import BrandingTab from '@/components/admin/settings/tabs/BrandingTab';
import ClubTab from '@/components/admin/settings/tabs/ClubTab';
import FeaturesTab from '@/components/admin/settings/tabs/FeaturesTab';
import CommunicationTab from '@/components/admin/settings/tabs/CommunicationTab';
import AnalyticsTab from '@/components/admin/settings/tabs/AnalyticsTab';
import SecurityTab from '@/components/admin/settings/tabs/SecurityTab';
import MobileTab from '@/components/admin/settings/tabs/MobileTab';
import SocialTab from '@/components/admin/settings/tabs/SocialTab';
import SeoTab from '@/components/admin/settings/tabs/SeoTab';
import SettingsHelpCard from '@/components/admin/settings/SettingsHelpCard';

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

  const isSettingConfigured = (key: string) => {
    return Boolean(getSettingValue(key));
  };

  const getBooleanValue = (key: string) => {
    const value = getSettingValue(key);
    return value === 'true';
  };

  const configuredCount = settings?.filter(s => s.value).length || 0;
  const totalRecommended = settings?.length || 0;

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

        <SettingsProgress 
          configuredCount={configuredCount} 
          totalRecommended={totalRecommended} 
        />
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <SettingsTabsList />

        <GeneralTab settings={settings || []} />
        <BrandingTab settings={settings || []} />
        <ClubTab settings={settings || []} />
        <FeaturesTab featureToggles={featureToggles || []} />
        <CommunicationTab settings={settings || []} getBooleanValue={getBooleanValue} />
        <AnalyticsTab settings={settings || []} />
        <SecurityTab settings={settings || []} getBooleanValue={getBooleanValue} />
        <MobileTab settings={settings || []} getBooleanValue={getBooleanValue} />
        <SocialTab getSettingValue={getSettingValue} isSettingConfigured={isSettingConfigured} />
        <SeoTab getSettingValue={getSettingValue} isSettingConfigured={isSettingConfigured} />
      </Tabs>

      <SettingsHelpCard />
    </div>
  );
};

export default SiteSettingsManagement;
