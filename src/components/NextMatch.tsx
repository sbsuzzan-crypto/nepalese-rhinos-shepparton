
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";

const NextMatch = () => {
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
                  <img 
                    src="/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png" 
                    alt="Nepalese Rhinos FC" 
                    className="h-20 w-20 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-bold text-rhino-blue">Nepalese Rhinos FC</h3>
                  <p className="text-rhino-gray">Home</p>
                </div>

                {/* Match Details */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-rhino-red mb-2">VS</div>
                  <div className="space-y-2 text-rhino-gray">
                    <div className="flex items-center justify-center gap-2">
                      <Calendar size={16} />
                      <span>Saturday, June 1st, 2024</span>
                    </div>
                    <div className="text-xl font-semibold">2:00 PM</div>
                    <div className="flex items-center justify-center gap-2">
                      <MapPin size={16} />
                      <span>McEwen Reserve, Shepparton</span>
                    </div>
                  </div>
                </div>

                {/* Away Team */}
                <div className="text-center">
                  <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-rhino-blue">Shepparton United</h3>
                  <p className="text-rhino-gray">Away</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-rhino-blue font-semibold">Weather Forecast: Partly Cloudy, 18°C</p>
                </div>
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
