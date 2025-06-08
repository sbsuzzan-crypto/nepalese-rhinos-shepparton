import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { format } from "date-fns";

interface Fixture {
  id: string;
  opponent: string;
  match_date: string;
  venue: string;
  is_home: boolean;
  status: string;
  home_score?: number;
  away_score?: number;
  match_report?: string;
}

const NextMatch = () => {
  const { data: nextFixture, isLoading, error } = useQuery({
    queryKey: ['next-fixture'],
    queryFn: async () => {
      console.log('Fetching next fixture from Supabase...');
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .gte('match_date', new Date().toISOString().split('T')[0])
        .eq('status', 'upcoming')
        .order('match_date', { ascending: true })
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching next fixture:', error);
        // If no fixtures found, return null instead of throwing
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      console.log('Next fixture fetched successfully:', data);
      return data as Fixture;
    },
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMMM do, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return "TBD";
    }
  };

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-rhino-blue">Next Match</h2>
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8 text-center">
                <p className="text-red-600">Unable to load fixture information. Please try again later.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-rhino-blue">Next Match</h2>
            <Card className="bg-white shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-rhino-blue to-rhino-navy text-white">
                <Skeleton className="h-8 w-32 mx-auto bg-white/20" />
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                  <div className="text-center">
                    <Skeleton className="h-20 w-20 mx-auto mb-4 rounded-full" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-12 w-16 mx-auto mb-4" />
                    <Skeleton className="h-4 w-40 mx-auto mb-2" />
                    <Skeleton className="h-6 w-20 mx-auto mb-2" />
                    <Skeleton className="h-4 w-48 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-20 w-20 mx-auto mb-4 rounded-full" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  if (!nextFixture) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-rhino-blue">Next Match</h2>
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Calendar className="h-16 w-16 text-rhino-gray" />
                  <h3 className="text-xl font-semibold text-rhino-blue">No Upcoming Matches</h3>
                  <p className="text-rhino-gray">Check back soon for fixture announcements!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  // Determine home and away teams based on is_home flag - Fixed team name
  const homeTeam = nextFixture.is_home ? "Nepalese Rhinos FC" : nextFixture.opponent;
  const awayTeam = nextFixture.is_home ? nextFixture.opponent : "Nepalese Rhinos FC";

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-rhino-blue">Next Match</h2>
          
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-rhino-blue to-rhino-navy text-white">
              <CardTitle className="text-2xl text-center">Match Day</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Home Team */}
                <div className="text-center">
                  {homeTeam.toLowerCase().includes('rhinos') ? (
                    <img 
                      src="/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png" 
                      alt={homeTeam} 
                      className="h-20 w-20 mx-auto mb-4"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users size={32} className="text-gray-500" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-rhino-blue">{homeTeam}</h3>
                  <p className="text-rhino-gray">Home</p>
                </div>

                {/* Match Details */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-rhino-red mb-2">VS</div>
                  <div className="space-y-2 text-rhino-gray">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(nextFixture.match_date)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Clock size={16} />
                      <span className="text-xl font-semibold">{formatTime(nextFixture.match_date)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin size={16} />
                      <span>{nextFixture.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-center">
                  {awayTeam.toLowerCase().includes('rhinos') ? (
                    <img 
                      src="/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png" 
                      alt={awayTeam} 
                      className="h-20 w-20 mx-auto mb-4"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users size={32} className="text-gray-500" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-rhino-blue">{awayTeam}</h3>
                  <p className="text-rhino-gray">Away</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button className="bg-rhino-red hover:bg-red-700 text-white">
                  Get Directions to Venue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NextMatch;
