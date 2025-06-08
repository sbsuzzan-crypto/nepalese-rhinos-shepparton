
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Shield, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import NextMatch from "./NextMatch";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const slides = [
    {
      image: "/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png",
      title: "Nepalese Rhinos FC",
      subtitle: "Rising Together, Playing with Pride",
      description: "Join us in our journey as we represent the Nepalese community through the beautiful game of football.",
      ctaText: "Join Our Team",
      ctaLink: "/join-us"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const stats = [
    { icon: Users, label: "Active Players", value: "25+", color: "text-blue-600" },
    { icon: Trophy, label: "Matches Played", value: "50+", color: "text-yellow-600" },
    { icon: Shield, label: "Years Active", value: "2", color: "text-green-600" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 scale-105"
          style={{
            backgroundImage: `url(${slides[currentSlide].image})`
          }}
        />
        
        {/* Multi-layer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-rhino-blue/90 via-rhino-blue/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-1">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping" />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-rhino-red/30 rounded-full animate-bounce" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-20">
          
          {/* Content Section */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
              <Shield className="w-4 h-4" />
              Est. 2023
            </div>

            {/* Main Heading */}
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                <span className="block">Nepalese</span>
                <span className="block text-rhino-red">Rhinos FC</span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-medium max-w-2xl">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
              {slides[currentSlide].description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 py-6 lg:py-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-sm rounded-full group-hover:bg-white/20 transition-all duration-300">
                      <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color} text-white`} />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <Link to={slides[currentSlide].ctaLink}>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-rhino-red hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
                >
                  {slides[currentSlide].ctaText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Highlights
              </Button>
            </div>
          </div>

          {/* Next Match Section */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md lg:max-w-lg">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-1 shadow-2xl">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-rhino-blue mb-4 text-center">
                      Next Match
                    </h3>
                    <NextMatch />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center text-white/70 animate-bounce">
          <div className="text-xs mb-2 hidden sm:block">Scroll to explore</div>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 z-10 text-white hover:text-red-400 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 text-white/50" />
                <p>Video content would be embedded here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
