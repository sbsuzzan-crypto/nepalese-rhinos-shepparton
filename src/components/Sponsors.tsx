
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Award, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
      case 'gold': return 'bg-gradient-to-r from-amber-400 to-yellow-600';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-red-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
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
            <div className="text-center text-red-600 bg-white rounded-lg shadow-lg p-8">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardContent className="p-6">
                    <Skeleton className="w-24 h-24 mx-auto mb-4 rounded-full" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sponsors && sponsors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {sponsors.map((sponsor) => (
                <Card 
                  key={sponsor.id} 
                  className="text-center hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white"
                  onClick={() => sponsor.website_url && window.open(sponsor.website_url, '_blank')}
                >
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-gray-100">
                        {sponsor.logo_url ? (
                          <img 
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="text-3xl font-bold text-rhino-blue">
                            {sponsor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                        {getTierIcon(sponsor.tier)}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-rhino-blue mb-2 group-hover:text-rhino-red transition-colors">
                      {sponsor.name}
                    </h3>
                    
                    <Badge className={`${getTierColor(sponsor.tier)} text-white mb-3 font-medium`}>
                      {getTierLabel(sponsor.tier)}
                    </Badge>
                    
                    {sponsor.description && (
                      <p className="text-sm text-rhino-gray mb-3 line-clamp-2">{sponsor.description}</p>
                    )}
                    
                    {sponsor.website_url && (
                      <p className="text-xs text-rhino-red group-hover:underline font-medium flex items-center justify-center gap-1">
                        Visit Website <ArrowRight className="h-3 w-3" />
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-rhino-gray bg-white rounded-lg shadow-lg p-8 mb-12">
              <p>No sponsors information available at the moment.</p>
            </div>
          )}

          <div className="text-center bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-rhino-blue to-blue-700 text-white p-8">
              <h3 className="text-2xl font-bold mb-4">Become a Sponsor</h3>
              <p className="text-lg opacity-90 mb-6">
                Join our family of sponsors and help support the growth of Nepalese football in the community.
              </p>
              <Link to="/become-a-sponsor">
                <Button className="bg-rhino-red hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold">
                  Partner With Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="p-6 bg-gray-50">
              <p className="text-rhino-gray text-sm">
                Explore our sponsorship packages and discover how we can work together to strengthen our community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
