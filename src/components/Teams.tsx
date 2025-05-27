
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Teams = () => {
  const players = [
    { name: "Rajesh Shrestha", position: "Goalkeeper", number: 1 },
    { name: "Bikash Tamang", position: "Defender", number: 3 },
    { name: "Pradeep Gurung", position: "Midfielder", number: 8 },
    { name: "Sunil Rai", position: "Forward", number: 10 },
    { name: "Nabin Thapa", position: "Defender", number: 5 },
    { name: "Deepak Limbu", position: "Midfielder", number: 7 },
  ];

  const staff = [
    { name: "Coach Kumar Magar", role: "Head Coach" },
    { name: "Pemba Sherpa", role: "Assistant Coach" },
    { name: "Dr. Sarah Johnson", role: "Team Physio" },
  ];

  return (
    <section id="teams" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Our Team</h2>
            <p className="text-rhino-gray text-lg">Meet the players and staff who make Nepalese Rhinos FC great</p>
          </div>

          {/* Coaching Staff */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-rhino-blue mb-8 text-center">Coaching Staff</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {staff.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-rhino-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-rhino-blue">{member.name}</h4>
                    <p className="text-rhino-gray">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Players */}
          <div>
            <h3 className="text-2xl font-bold text-rhino-blue mb-8 text-center">Senior Squad</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-rhino-blue">{player.name}</CardTitle>
                      <div className="w-10 h-10 bg-rhino-red text-white rounded-full flex items-center justify-center font-bold">
                        {player.number}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-rhino-gray font-medium">{player.position}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-rhino-gray">
              Interested in joining our squad? <a href="#join" className="text-rhino-red font-semibold hover:underline">Contact us today!</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teams;
