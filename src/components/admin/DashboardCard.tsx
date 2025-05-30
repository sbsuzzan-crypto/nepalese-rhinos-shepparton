
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
  color?: string;
  iconBg?: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon, 
  href, 
  color = 'bg-rhino-blue',
  iconBg = 'bg-blue-100',
  description,
  trend 
}: DashboardCardProps) => {
  const CardComponent = href ? Link : 'div';
  
  return (
    <CardComponent 
      to={href || '#'} 
      className={`block ${href ? 'hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer' : ''}`}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            {title}
          </CardTitle>
          <div className={`p-3 rounded-xl ${iconBg} shadow-md`}>
            <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {trend && (
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
          <div className={`absolute bottom-0 left-0 w-full h-1 ${color}`}></div>
        </CardContent>
      </Card>
    </CardComponent>
  );
};

export default DashboardCard;
