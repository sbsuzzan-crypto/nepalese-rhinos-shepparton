
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="home" className="relative bg-gradient-to-r from-rhino-blue to-rhino-navy text-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to <span className="text-rhino-red">Nepalese Rhinos FC</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Where passion meets tradition. Join our proud football community in Shepparton, bringing together Nepalese heritage and Australian spirit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join-us">
              <Button 
                size="lg" 
                className="bg-rhino-red hover:bg-red-700 text-white px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Join Our Club
              </Button>
            </Link>
            <Link to="/fixtures">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-rhino-blue px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                View Fixtures
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-rhino-red/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
    </section>
  );
};

export default Hero;
