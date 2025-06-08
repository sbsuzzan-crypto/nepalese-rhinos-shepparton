
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface SettingsCategoryProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const SettingsCategory = ({ 
  title, 
  description, 
  icon: Icon, 
  children 
}: SettingsCategoryProps) => {
  return (
    <Card className="border-l-4 border-l-rhino-red">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <div className="p-2 bg-rhino-red/10 rounded-lg">
            <Icon className="w-5 h-5 text-rhino-red" />
          </div>
          {title}
        </CardTitle>
        <CardDescription className="text-slate-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default SettingsCategory;
