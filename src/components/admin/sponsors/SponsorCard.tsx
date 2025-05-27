
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ExternalLink, Star, Award, Trophy } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Sponsor = Database['public']['Tables']['sponsors']['Row'];

interface SponsorCardProps {
  sponsor: Sponsor;
  onEdit: (sponsor: Sponsor) => void;
  onDelete: (id: string) => void;
}

const getTierIcon = (tier: string | null) => {
  switch (tier?.toLowerCase()) {
    case 'gold': return <Trophy className="text-yellow-500" size={16} />;
    case 'silver': return <Award className="text-gray-400" size={16} />;
    case 'bronze': return <Star className="text-orange-600" size={16} />;
    default: return <Star className="text-gray-500" size={16} />;
  }
};

const getTierColor = (tier: string | null) => {
  switch (tier?.toLowerCase()) {
    case 'gold': return 'bg-yellow-500';
    case 'silver': return 'bg-gray-400';
    case 'bronze': return 'bg-orange-600';
    default: return 'bg-gray-500';
  }
};

const SponsorCard = ({ sponsor, onEdit, onDelete }: SponsorCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {sponsor.logo_url ? (
                <img 
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-xl font-bold text-gray-500">
                  {sponsor.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{sponsor.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getTierIcon(sponsor.tier)}
                <Badge className={`${getTierColor(sponsor.tier)} text-white text-xs`}>
                  {sponsor.tier?.toUpperCase() || 'BRONZE'}
                </Badge>
                <Badge variant={sponsor.is_active ? 'default' : 'secondary'} className="text-xs">
                  {sponsor.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(sponsor)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(sponsor.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {sponsor.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {sponsor.description}
          </p>
        )}
        
        {sponsor.website_url && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(sponsor.website_url!, '_blank')}
              className="text-rhino-red hover:text-red-700"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit Website
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SponsorCard;
