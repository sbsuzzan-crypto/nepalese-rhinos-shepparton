
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock } from "lucide-react";

const Fixtures = () => {
  const fixtures = [
    {
      date: "June 1, 2024",
      time: "2:00 PM",
      opponent: "Shepparton United",
      venue: "McEwen Reserve",
      type: "Home",
      status: "upcoming"
    },
    {
      date: "June 8, 2024",
      time: "3:00 PM",
      opponent: "Mooroopna FC",
      venue: "Mooroopna Recreation Reserve",
      type: "Away",
      status: "upcoming"
    },
    {
      date: "May 25, 2024",
      time: "2:00 PM",
      opponent: "Euroa FC",
      venue: "McEwen Reserve",
      type: "Home",
      status: "completed",
      result: "W 2-1"
    },
    {
      date: "May 18, 2024",
      time: "1:30 PM",
      opponent: "Benalla City",
      venue: "Benalla City Stadium",
      type: "Away",
      status: "completed",
      result: "L 0-3"
    }
  ];

  return (
    <section id="fixtures" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Fixtures & Results</h2>
            <p className="text-rhino-gray text-lg">Follow our journey through the season</p>
          </div>

          <div className="space-y-6">
            {fixtures.map((fixture, index) => (
              <Card key={index} className={`overflow-hidden ${fixture.status === 'upcoming' ? 'ring-2 ring-rhino-red' : ''}`}>
                <CardHeader className={`${fixture.status === 'upcoming' ? 'bg-rhino-red text-white' : 'bg-gray-100'}`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className={`text-lg ${fixture.status === 'upcoming' ? 'text-white' : 'text-rhino-blue'}`}>
                      Nepalese Rhinos FC vs {fixture.opponent}
                    </CardTitle>
                    {fixture.status === 'completed' && (
                      <span className={`font-bold ${fixture.result?.startsWith('W') ? 'text-green-600' : 'text-red-600'}`}>
                        {fixture.result}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-rhino-gray">
                      <Calendar size={16} />
                      <span>{fixture.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-rhino-gray">
                      <Clock size={16} />
                      <span>{fixture.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-rhino-gray">
                      <MapPin size={16} />
                      <span>{fixture.venue} ({fixture.type})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
