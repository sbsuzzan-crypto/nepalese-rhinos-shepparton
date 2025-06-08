
import { TabsContent } from '@/components/ui/tabs';
import { Zap } from 'lucide-react';
import SettingsCategory from '../SettingsCategory';
import FeatureToggleCard from '../FeatureToggleCard';

interface FeaturesTabProps {
  featureToggles: any[];
}

const FeaturesTab = ({ featureToggles }: FeaturesTabProps) => {
  const groupedToggles = featureToggles?.reduce((acc, toggle) => {
    if (!acc[toggle.category]) {
      acc[toggle.category] = [];
    }
    acc[toggle.category].push(toggle);
    return acc;
  }, {} as Record<string, typeof featureToggles>) || {};

  return (
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
  );
};

export default FeaturesTab;
