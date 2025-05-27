
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const LatestNews = () => {
  const news = [
    {
      id: 1,
      title: "Season Registration Now Open",
      excerpt: "Join us for the 2024 season! Registration is now open for new and returning players.",
      date: "May 25, 2024",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Victory Against Mooroopna FC",
      excerpt: "Fantastic 3-1 victory in our home match last weekend. Great team performance!",
      date: "May 20, 2024",
      image: "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Community BBQ Success",
      excerpt: "Thank you to everyone who attended our community BBQ fundraiser. Over $2000 raised!",
      date: "May 15, 2024",
      image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=250&fit=crop"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-rhino-blue mb-4">Latest Updates</h2>
          <p className="text-rhino-gray text-lg">Stay up to date with club news and announcements</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-rhino-gray mb-2">
                  <Calendar size={16} />
                  <span>{item.date}</span>
                </div>
                <CardTitle className="text-xl text-rhino-blue">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-rhino-gray mb-4">{item.excerpt}</p>
                <Button variant="outline" className="w-full border-rhino-blue text-rhino-blue hover:bg-rhino-blue hover:text-white">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="bg-rhino-blue hover:bg-rhino-navy text-white px-8 py-3">
            View All Updates
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
