
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import MobileSidebar from "./MobileSidebar";
import AuthButton from "./AuthButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Teams", href: "/teams" },
    { name: "Fixtures", href: "/fixtures" },
    { name: "Gallery", href: "/gallery" },
    { name: "Join Us", href: "/join-us" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`bg-white sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? 'shadow-lg py-2' : 'shadow-md py-4'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png" 
                alt="Nepalese Rhinos FC" 
                className={`transition-all duration-300 group-hover:scale-105 ${
                  isScrolled ? 'h-10 w-10' : 'h-12 w-12'
                }`}
              />
              <div className="transition-all duration-300">
                <h1 className={`font-bold text-rhino-blue transition-all duration-300 ${
                  isScrolled ? 'text-lg' : 'text-xl'
                }`}>
                  Nepalese Rhinos FC
                </h1>
                <p className={`text-rhino-gray transition-all duration-300 ${
                  isScrolled ? 'text-xs' : 'text-sm'
                }`}>
                  Est. 2023
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg group ${
                    isActive(item.href)
                      ? "text-rhino-red"
                      : "text-rhino-blue hover:text-rhino-red hover:bg-rhino-red/5"
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-1/2 h-0.5 bg-rhino-red transition-all duration-300 transform -translate-x-1/2 ${
                    isActive(item.href) 
                      ? "w-full" 
                      : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Auth Button and Mobile Menu */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <AuthButton />
              </div>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-rhino-blue hover:text-rhino-red hover:bg-rhino-red/5 transition-all duration-200"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  );
};

export default Header;
