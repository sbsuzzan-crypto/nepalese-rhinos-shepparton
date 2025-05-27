
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Heart, Star } from "lucide-react";

const JoinUs = () => {
  const benefits = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description: "Join a welcoming, diverse football community in Shepparton"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Competition",
      description: "Compete in the Goulburn North East Football League"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Fitness & Fun",
      description: "Stay fit while having fun and making lifelong friendships"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Development",
      description: "Improve your skills with quality coaching and training"
    }
  ];

  return (
    <section id="join" className="py-16 bg-gradient-to-br from-rhino-blue to-rhino-navy text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join Nepalese Rhinos FC</h2>
            <p className="text-xl opacity-90">
              Whether you're a seasoned player or just starting out, we welcome everyone to our football family
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6">Why Join Us?</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-rhino-red flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{benefit.title}</h4>
                      <p className="text-sm opacity-90">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-white text-rhino-blue">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Ready to Join?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-bold mb-2">What We Offer:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Weekly training sessions</li>
                    <li>• Competitive league matches</li>
                    <li>• Social events and BBQs</li>
                    <li>• Professional coaching</li>
                    <li>• All skill levels welcome</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">Season Fee:</h4>
                  <p className="text-2xl font-bold text-rhino-red">$200</p>
                  <p className="text-sm text-rhino-gray">Includes registration, insurance, and team kit</p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-rhino-red hover:bg-red-700 text-white">
                    Register Now
                  </Button>
                  <Button variant="outline" className="w-full border-rhino-blue text-rhino-blue hover:bg-rhino-blue hover:text-white">
                    Contact for More Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Training Schedule</h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold mb-1">Tuesday Nights</h4>
                  <p className="text-sm">7:00 PM - 8:30 PM</p>
                  <p className="text-sm opacity-75">McEwen Reserve</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold mb-1">Thursday Nights</h4>
                  <p className="text-sm">7:00 PM - 8:30 PM</p>
                  <p className="text-sm opacity-75">McEwen Reserve</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
