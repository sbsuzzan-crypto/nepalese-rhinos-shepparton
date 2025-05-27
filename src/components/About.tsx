
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Heart, Trophy } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Respect",
      description: "We treat all players, officials, and supporters with respect and dignity."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Teamwork",
      description: "Success comes through working together, both on and off the field."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Inclusivity",
      description: "Our club welcomes players from all backgrounds and skill levels."
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, while having fun."
    }
  ];

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">About Nepalese Rhinos FC</h2>
            <p className="text-rhino-gray text-lg max-w-3xl mx-auto">
              Founded in 2023, Nepalese Rhinos FC is more than just a football club. We're a community that brings together the rich heritage of Nepal with the sporting spirit of Australia.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-rhino-blue mb-4">Our Story</h3>
              <p className="text-rhino-gray mb-4">
                Based in Shepparton, we compete in the Goulburn North East Football League and are proud members of Football Victoria. Our club was established to create a welcoming space for the Nepalese community while embracing players from all backgrounds.
              </p>
              <p className="text-rhino-gray mb-4">
                The mighty rhino represents strength, determination, and resilience - qualities that define our approach to football and community building.
              </p>
              <p className="text-rhino-gray">
                We're committed to developing not just skilled footballers, but well-rounded individuals who contribute positively to our community.
              </p>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop" 
                alt="Team photo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-rhino-blue text-center mb-8">Our Values</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="text-rhino-red mb-4 flex justify-center">
                      {value.icon}
                    </div>
                    <h4 className="text-xl font-bold text-rhino-blue mb-2">{value.title}</h4>
                    <p className="text-rhino-gray">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
