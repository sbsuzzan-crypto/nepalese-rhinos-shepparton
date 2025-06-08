
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

interface SettingsProgressProps {
  configuredCount: number;
  totalRecommended: number;
}

const SettingsProgress = ({ configuredCount, totalRecommended }: SettingsProgressProps) => {
  return (
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
  );
};

export default SettingsProgress;
