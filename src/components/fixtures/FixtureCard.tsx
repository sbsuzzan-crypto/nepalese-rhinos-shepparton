
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { formatDate, formatTime } from "@/utils/formatters";
import { Fixture } from "@/types";

interface FixtureCardProps {
  fixture: Fixture;
  variant?: 'default' | 'compact';
}

const FixtureCard = ({ fixture, variant = 'default' }: FixtureCardProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { color: 'bg-blue-500', text: 'Upcoming', textColor: 'text-blue-700' };
      case 'live':
        return { color: 'bg-red-500', text: 'Live', textColor: 'text-red-700' };
      case 'completed':
        return { color: 'bg-green-500', text: 'Completed', textColor: 'text-green-700' };
      case 'cancelled':
        return { color: 'bg-gray-500', text: 'Cancelled', textColor: 'text-gray-700' };
      case 'postponed':
        return { color: 'bg-yellow-500', text: 'Postponed', textColor: 'text-yellow-700' };
      default:
        return { color: 'bg-gray-500', text: 'Unknown', textColor: 'text-gray-700' };
    }
  };

  const statusConfig = getStatusConfig(fixture.status);
  const isCompleted = fixture.status === 'completed';
  const hasScore = isCompleted && (fixture.home_score !== null || fixture.away_score !== null);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] touch-manipulation">
      <CardContent className={`p-4 sm:p-6 ${variant === 'compact' ? 'p-3 sm:p-4' : ''}`}>
        {/* Header with Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${statusConfig.color} rounded-full animate-pulse`} />
            <Badge variant="secondary" className={`${statusConfig.textColor} bg-opacity-10 text-xs sm:text-sm`}>
              {statusConfig.text}
            </Badge>
          </div>
          
          {/* Date and Time */}
          <div className="flex items-center gap-1 text-slate-600 text-xs sm:text-sm">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{formatDate(fixture.match_date)}</span>
            <span className="sm:hidden">{formatDate(fixture.match_date).split(',')[0]}</span>
          </div>
        </div>

        {/* Match Details */}
        <div className="space-y-4">
          {/* Teams and Score */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rhino-red rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs sm:text-sm">NR</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-rhino-blue text-sm sm:text-base truncate">
                    Nepalese Rhinos FC
                  </p>
                  <p className="text-xs text-slate-600">{fixture.is_home ? 'Home' : 'Away'}</p>
                </div>
                {hasScore && (
                  <div className="text-xl sm:text-2xl font-bold text-rhino-blue">
                    {fixture.is_home ? fixture.home_score : fixture.away_score}
                  </div>
                )}
              </div>

              <Separator className="my-2" />

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                    {fixture.opponent}
                  </p>
                  <p className="text-xs text-slate-600">{fixture.is_home ? 'Away' : 'Home'}</p>
                </div>
                {hasScore && (
                  <div className="text-xl sm:text-2xl font-bold text-slate-700">
                    {fixture.is_home ? fixture.away_score : fixture.home_score}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Match Info */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{fixture.venue}</span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-600 text-xs sm:text-sm">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{formatTime(fixture.match_date.split('T')[1] || '15:00:00')}</span>
            </div>
          </div>

          {/* Match Report Link */}
          {fixture.match_report && isCompleted && (
            <div className="pt-2">
              <button className="text-rhino-red hover:text-red-700 text-xs sm:text-sm font-medium transition-colors duration-200 underline-offset-4 hover:underline">
                Read Match Report →
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FixtureCard;
