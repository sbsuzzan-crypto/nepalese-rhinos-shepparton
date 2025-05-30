
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

const QuickActionCard = ({ 
  title, 
  description, 
  href, 
  icon: Icon, 
  color 
}: QuickActionCardProps) => {
  return (
    <Link to={href}>
      <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 shadow-lg bg-white overflow-hidden group">
        <CardContent className="p-6 relative">
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-rhino-red transition-colors duration-300">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rhino-red to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default QuickActionCard;
