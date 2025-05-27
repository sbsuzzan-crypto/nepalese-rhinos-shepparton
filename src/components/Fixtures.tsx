
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Fixture {
  id: string;
  opponent: string;
  venue: string;
  match_date: string;
  is_home: boolean;
  status: "upcoming" | "live" | "completed" | "cancelled" | "postponed";
  home_score: number | null;
  away_score: number | null;
  match_report: string | null;
}

const Fixtures = () => {
  const { data: fixtures, isLoading, error } = useQuery({
    queryKey: ['fixtures'],
    queryFn: async () => {
      console.log('Fetching fixtures from Supabase...');
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .order('match_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching fixtures:', error);
        throw error;
      }
      
      console.log('Fixtures fetched successfully:', data);
      return data as Fixture[];
    },
  });

  const formatMatchDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatMatchTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch {
      return "TBD";
    }
  };

  const getResult = (fixture: Fixture) => {
    if (fixture.status !== 'completed' || fixture.home_score === null || fixture.away_score === null) {
      return null;
    }
    
    if (fixture.is_home) {
      // Rhinos are home team
      if (fixture.home_score > fixture.away_score) return `W ${fixture.home_score}-${fixture.away_score}`;
      if (fixture.home_score < fixture.away_score) return `L ${fixture.home_score}-${fixture.away_score}`;
      return `D ${fixture.home_score}-${fixture.away_score}`;
    } else {
      // Rhinos are away team
      if (fixture.away_score > fixture.home_score) return `W ${fixture.away_score}-${fixture.home_score}`;
      if (fixture.away_score < fixture.home_score) return `L ${fixture.away_score}-${fixture.home_score}`;
      return `D ${fixture.away_score}-${fixture.home_score}`;
    }
  };

  if (error) {
    return (
      <section id="fixtures" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-rhino-blue mb-4">Fixtures & Results</h2>
              <p className="text-rhino-gray text-lg">Follow our journey through the season</p>
            </div>
            <div className="text-center text-red-600">
              <p>Unable to load fixtures. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="fixtures" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Fixtures & Results</h2>
            <p className="text-rhino-gray text-lg">Follow our journey through the season</p>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="bg-gray-100">
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : fixtures && fixtures.length > 0 ? (
              fixtures.map((fixture) => {
                const result = getResult(fixture);
                return (
                  <Card key={fixture.id} className={`overflow-hidden ${fixture.status === 'upcoming' ? 'ring-2 ring-rhino-red' : ''}`}>
                    <CardHeader className={`${fixture.status === 'upcoming' ? 'bg-rhino-red text-white' : 'bg-gray-100'}`}>
                      <div className="flex justify-between items-center">
                        <CardTitle className={`text-lg ${fixture.status === 'upcoming' ? 'text-white' : 'text-rhino-blue'}`}>
                          Nepalese Rhinos FC vs {fixture.opponent}
                        </CardTitle>
                        {result && (
                          <span className={`font-bold ${result.startsWith('W') ? 'text-green-600' : result.startsWith('L') ? 'text-red-600' : 'text-yellow-600'}`}>
                            {result}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-rhino-gray">
                          <Calendar size={16} />
                          <span>{formatMatchDate(fixture.match_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-rhino-gray">
                          <Clock size={16} />
                          <span>{formatMatchTime(fixture.match_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-rhino-gray">
                          <MapPin size={16} />
                          <span>{fixture.venue} ({fixture.is_home ? 'Home' : 'Away'})</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center text-rhino-gray">
                <p>No fixtures available at the moment.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <p className="text-rhino-gray mb-4">
              League Table: <span className="font-semibold">5th place</span> | Points: <span className="font-semibold">12</span> | Played: <span className="font-semibold">8</span>
            </p>
            <a href="#" className="text-rhino-red font-semibold hover:underline">
              View Full League Table →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fixtures;
