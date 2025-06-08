
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import AuthButton from "./AuthButton";
import { useAuth } from '@/hooks/useAuth';
import Logo from "./header/Logo";
import Navigation from "./header/Navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

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
            <Logo isScrolled={isScrolled} />
            <Navigation isScrolled={isScrolled} />

            <div className="flex items-center gap-2">
              {user && (
                <div className="hidden md:block">
                  <AuthButton />
                </div>
              )}
              
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

      <MobileSidebar 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  );
};

export default Header;
