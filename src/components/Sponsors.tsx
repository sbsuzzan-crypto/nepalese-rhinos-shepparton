
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Award, Trophy } from "lucide-react";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string | null;
  description: string | null;
  is_active: boolean | null;
}

const Sponsors = () => {
  const { data: sponsors, isLoading, error } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async () => {
      console.log('Fetching sponsors from Supabase...');
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('is_active', true)
        .order('tier', { ascending: true });
      
      if (error) {
        console.error('Error fetching sponsors:', error);
        throw error;
      }
      
      console.log('Sponsors fetched successfully:', data);
      return data as Sponsor[];
    },
  });

  const getTierIcon = (tier: string | null) => {
    switch (tier?.toLowerCase()) {
      case 'gold': return <Trophy className="text-amber-500" size={20} />;
      case 'silver': return <Award className="text-gray-400" size={20} />;
      case 'bronze': return <Star className="text-orange-600" size={20} />;
      default: return <Star className="text-gray-500" size={20} />;
    }
  };

  const getTierColor = (tier: string | null) => {
    switch (tier?.toLowerCase()) {
      case 'gold': return 'bg-amber-500';
      case 'silver': return 'bg-gray-400';
      case 'bronze': return 'bg-orange-600';
      default: return 'bg-gray-500';
    }
  };

  const getTierLabel = (tier: string | null) => {
    switch (tier?.toLowerCase()) {
      case 'gold': return 'Gold Partner';
      case 'silver': return 'Silver Partner';
      case 'bronze': return 'Bronze Partner';
      default: return 'Partner';
    }
  };

  if (error) {
    return (
      <section id="sponsors" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-rhino-blue mb-4">Our Sponsors</h2>
              <p className="text-rhino-gray text-lg">Proud to be supported by these amazing partners</p>
            </div>
            <div className="text-center text-red-600">
              <p>Unable to load sponsors. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sponsors" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Our Sponsors</h2>
            <p className="text-rhino-gray text-lg">Proud to be supported by these amazing partners</p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Skeleton className="w-24 h-24 mx-auto mb-4 rounded-full" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sponsors && sponsors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sponsors.map((sponsor) => (
                <Card 
                  key={sponsor.id} 
                  className="text-center hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => sponsor.website_url && window.open(sponsor.website_url, '_blank')}
                >
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
                        {sponsor.logo_url ? (
                          <img 
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="text-4xl font-bold text-rhino-blue">
                            {sponsor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="absolute -top-2 -right-2">
                        {getTierIcon(sponsor.tier)}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-rhino-blue mb-2 group-hover:text-rhino-red transition-colors">
                      {sponsor.name}
                    </h3>
                    
                    <Badge className={`${getTierColor(sponsor.tier)} text-white mb-2`}>
                      {getTierLabel(sponsor.tier)}
                    </Badge>
                    
                    {sponsor.description && (
                      <p className="text-sm text-rhino-gray">{sponsor.description}</p>
                    )}
                    
                    {sponsor.website_url && (
                      <p className="text-xs text-rhino-red mt-2 group-hover:underline">
                        Visit Website →
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-rhino-gray">
              <p>No sponsors information available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12 p-8 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-rhino-blue mb-4">Become a Sponsor</h3>
            <p className="text-rhino-gray mb-6">
              Join our family of sponsors and help support the growth of Nepalese football in the community.
            </p>
            <button className="bg-rhino-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
