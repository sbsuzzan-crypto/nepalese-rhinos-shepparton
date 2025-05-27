
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, Camera, UserPlus, Mail, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileBottomNav = () => {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();

  const primaryNavItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: Users },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Fixtures", href: "/fixtures", icon: Calendar },
  ];

  const moreNavItems = [
    { name: "Gallery", href: "/gallery", icon: Camera },
    { name: "Join Us", href: "/join-us", icon: UserPlus },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  const handleMoreClick = () => {
    setShowMore(!showMore);
  };

  const handleItemClick = () => {
    setShowMore(false);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleItemClick}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-rhino-red bg-rhino-red/10"
                    : "text-rhino-gray hover:text-rhino-blue hover:bg-gray-100"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          {/* More Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMoreClick}
            className={`flex flex-col items-center py-2 px-3 h-auto transition-all duration-200 ${
              showMore
                ? "text-rhino-red bg-rhino-red/10"
                : "text-rhino-gray hover:text-rhino-blue hover:bg-gray-100"
            }`}
          >
            {showMore ? <X size={20} /> : <MoreHorizontal size={20} />}
            <span className="text-xs mt-1 font-medium">More</span>
          </Button>
        </div>
      </nav>

      {/* Expandable More Menu */}
      {showMore && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
            onClick={() => setShowMore(false)}
          />
          
          {/* More Menu */}
          <div className="md:hidden fixed bottom-16 left-4 right-4 bg-white rounded-lg shadow-xl border z-50 animate-in slide-in-from-bottom-2 duration-300">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-rhino-blue mb-3">More Options</h3>
              <div className="space-y-1">
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={handleItemClick}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? "text-rhino-red bg-rhino-red/10"
                          : "text-rhino-blue hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileBottomNav;
