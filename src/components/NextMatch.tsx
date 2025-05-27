
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { format } from "date-fns";

interface Fixture {
  id: string;
  home_team: string;
  away_team: string;
  match_date: string;
  match_time: string;
  venue: string;
  home_team_logo?: string;
  away_team_logo?: string;
  status: string;
  weather_forecast?: string;
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
        .eq('status', 'scheduled')
        .order('match_date', { ascending: true })
        .order('match_time', { ascending: true })
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

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, "h:mm a");
    } catch {
      return timeString;
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
                  {nextFixture.home_team_logo ? (
                    <img 
                      src={nextFixture.home_team_logo} 
                      alt={nextFixture.home_team} 
                      className="h-20 w-20 mx-auto mb-4 object-contain"
                    />
                  ) : nextFixture.home_team.toLowerCase().includes('rhinos') ? (
                    <img 
                      src="/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png" 
                      alt={nextFixture.home_team} 
                      className="h-20 w-20 mx-auto mb-4"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users size={32} className="text-gray-500" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-rhino-blue">{nextFixture.home_team}</h3>
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
                      <span className="text-xl font-semibold">{formatTime(nextFixture.match_time)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin size={16} />
                      <span>{nextFixture.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-center">
                  {nextFixture.away_team_logo ? (
                    <img 
                      src={nextFixture.away_team_logo} 
                      alt={nextFixture.away_team} 
                      className="h-20 w-20 mx-auto mb-4 object-contain"
                    />
                  ) : nextFixture.away_team.toLowerCase().includes('rhinos') ? (
                    <img 
                      src="/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png" 
                      alt={nextFixture.away_team} 
                      className="h-20 w-20 mx-auto mb-4"
                    />
                  ) : (
                    <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users size={32} className="text-gray-500" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-rhino-blue">{nextFixture.away_team}</h3>
                  <p className="text-rhino-gray">Away</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                {nextFixture.weather_forecast && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-rhino-blue font-semibold">Weather Forecast: {nextFixture.weather_forecast}</p>
                  </div>
                )}
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
