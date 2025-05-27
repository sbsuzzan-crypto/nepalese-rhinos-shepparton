
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Star, Award } from "lucide-react";

interface Player {
  id: string;
  name: string;
  position: string;
  jersey_number: number | null;
  bio: string | null;
  photo_url: string | null;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
}

const Teams = () => {
  const { data: players, isLoading: playersLoading } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      console.log('Fetching players from Supabase...');
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('is_active', true)
        .order('jersey_number', { ascending: true });
      
      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }
      
      console.log('Players fetched successfully:', data);
      return data as Player[];
    },
  });

  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      console.log('Fetching staff from Supabase...');
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching staff:', error);
        throw error;
      }
      
      console.log('Staff fetched successfully:', data);
      return data as Staff[];
    },
  });

  const getPositionBadgeColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'goalkeeper': return 'bg-yellow-500';
      case 'defender': return 'bg-blue-500';
      case 'midfielder': return 'bg-green-500';
      case 'forward': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section id="teams" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Our Team</h2>
            <p className="text-rhino-gray text-lg">Meet the talented players and dedicated staff who make Nepalese Rhinos FC proud</p>
          </div>

          {/* Players Section */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Users className="text-rhino-red" size={24} />
              <h3 className="text-2xl font-bold text-rhino-blue">Players</h3>
            </div>
            
            {playersLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <Skeleton className="w-full h-48 mb-4 rounded-lg" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : players && players.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {players.map((player) => (
                  <Card key={player.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="relative mb-4">
                        <img 
                          src={player.photo_url || 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=300&h=300&fit=crop&crop=face'}
                          alt={player.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {player.jersey_number && (
                          <div className="absolute top-2 right-2 bg-rhino-red text-white text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                            {player.jersey_number}
                          </div>
                        )}
                      </div>
                      <h4 className="font-bold text-lg text-rhino-blue mb-2">{player.name}</h4>
                      <Badge className={`${getPositionBadgeColor(player.position)} text-white mb-2`}>
                        {player.position}
                      </Badge>
                      {player.bio && (
                        <p className="text-sm text-rhino-gray">{player.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-rhino-gray">
                <p>No players available at the moment.</p>
              </div>
            )}
          </div>

          {/* Staff Section */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Award className="text-rhino-red" size={24} />
              <h3 className="text-2xl font-bold text-rhino-blue">Coaching Staff</h3>
            </div>
            
            {staffLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <Skeleton className="w-full h-40 mb-4 rounded-lg" />
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : staff && staff.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                  <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <img 
                        src={member.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'}
                        alt={member.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                      <h4 className="font-bold text-lg text-rhino-blue mb-2">{member.name}</h4>
                      <Badge variant="outline" className="text-rhino-red border-rhino-red mb-2">
                        {member.role}
                      </Badge>
                      {member.bio && (
                        <p className="text-sm text-rhino-gray">{member.bio}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-rhino-gray">
                <p>No staff information available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teams;
