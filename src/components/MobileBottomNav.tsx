
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, Image, Phone } from "lucide-react";

const MobileBottomNav = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Fixtures", href: "/fixtures", icon: Calendar },
    { name: "Gallery", href: "/gallery", icon: Image },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className={`
      md:hidden fixed bottom-0 left-0 right-0 z-50 
      bg-white/95 backdrop-blur-lg border-t border-slate-200/50 
      shadow-lg transition-all duration-300 ease-in-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="px-2 py-1">
        <div className="flex justify-around items-center">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  relative flex flex-col items-center justify-center 
                  min-h-[60px] min-w-[60px] px-2 py-1 rounded-xl
                  transition-all duration-200 ease-out
                  active:scale-95 touch-manipulation
                  ${active 
                    ? 'text-rhino-red scale-105' 
                    : 'text-slate-600 hover:text-rhino-red hover:scale-105'
                  }
                `}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-rhino-red rounded-full animate-pulse" />
                )}
                
                {/* Icon with bounce animation */}
                <div className={`
                  p-1.5 rounded-lg transition-all duration-200
                  ${active ? 'bg-rhino-red/10 animate-pulse' : 'hover:bg-slate-100'}
                `}>
                  <item.icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                </div>
                
                {/* Label */}
                <span className={`
                  text-xs font-medium mt-0.5 transition-all duration-200
                  ${active ? 'text-rhino-red scale-105' : 'text-slate-600'}
                `}>
                  {item.name}
                </span>
                
                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className={`
                    absolute inset-0 bg-rhino-red/5 rounded-xl 
                    transform scale-0 transition-transform duration-300
                    ${active ? 'scale-100' : ''}
                  `} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-white/95" />
    </nav>
  );
};

export default MobileBottomNav;
