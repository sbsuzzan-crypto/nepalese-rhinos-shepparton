
import { Link, useLocation } from "react-router-dom";

interface NavigationItem {
  name: string;
  href: string;
}

interface NavigationProps {
  isScrolled: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isScrolled }) => {
  const location = useLocation();

  const navigation: NavigationItem[] = [
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

  return (
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
  );
};

export default Navigation;
