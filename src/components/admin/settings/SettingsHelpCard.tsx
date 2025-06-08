
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const SettingsHelpCard = () => {
  return (
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
  );
};

export default SettingsHelpCard;
