
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Fixture } from "@/types";
import { formatDateTime, formatTime } from "@/utils/formatters";

interface FixtureCardProps {
  fixture: Fixture;
}

const FixtureCard: React.FC<FixtureCardProps> = ({ fixture }) => {
  const homeTeam = fixture.is_home ? "Nepalese Rhinos FC" : fixture.opponent;
  const awayTeam = fixture.is_home ? fixture.opponent : "Nepalese Rhinos FC";

  return (
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
                <span>{formatDateTime(fixture.match_date)}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock size={16} />
                <span className="text-xl font-semibold">{formatTime(fixture.match_date)}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin size={16} />
                <span>{fixture.venue}</span>
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
  );
};

export default FixtureCard;
