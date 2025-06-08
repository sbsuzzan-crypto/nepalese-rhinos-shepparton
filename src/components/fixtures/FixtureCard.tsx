
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy } from "lucide-react";
import { formatDate, formatTime } from "@/utils/formatters";
import type { Fixture } from "@/types";

interface FixtureCardProps {
  fixture: Fixture;
}

const FixtureCard = ({ fixture }: FixtureCardProps) => {
  return (
    <Card className="bg-white shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-rhino-blue to-rhino-navy text-white">
        <CardTitle className="text-center text-2xl font-bold">Next Match</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Home Team */}
          <div className="text-center">
            <div className="w-20 h-20 bg-rhino-red rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-rhino-blue mb-2">{fixture.home_team}</h3>
            <Badge variant="secondary" className="text-sm">Home</Badge>
          </div>

          {/* Match Details */}
          <div className="text-center">
            <div className="text-4xl font-bold text-rhino-red mb-2">VS</div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-rhino-gray">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(fixture.match_date)}</span>
              </div>
              <div className="text-lg font-semibold text-rhino-blue">
                {formatTime(fixture.match_time)}
              </div>
              <div className="flex items-center justify-center gap-2 text-rhino-gray">
                <MapPin className="h-4 w-4" />
                <span>{fixture.venue}</span>
              </div>
            </div>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-rhino-blue mb-2">{fixture.away_team}</h3>
            <Badge variant="outline" className="text-sm">Away</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FixtureCard;
