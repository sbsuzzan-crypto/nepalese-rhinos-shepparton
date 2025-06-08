
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const NoUpcomingMatches = () => {
  return (
    <Card className="bg-white shadow-xl border-0">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <Calendar className="h-16 w-16 text-rhino-gray" />
          <h3 className="text-xl font-semibold text-rhino-blue">No Upcoming Matches</h3>
          <p className="text-rhino-gray">Check back soon for fixture announcements!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoUpcomingMatches;
