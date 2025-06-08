
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();

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

  // Close sidebar on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png" 
                alt="Nepalese Rhinos FC" 
                className="h-10 w-10"
              />
              <div>
                <h2 className="text-lg font-bold text-rhino-blue">Nepalese Rhinos FC</h2>
                <p className="text-sm text-rhino-gray">Est. 2023</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-rhino-gray hover:text-rhino-blue"
            >
              <X size={24} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <div className="space-y-2 px-6">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 animate-in slide-in-from-right ${
                    isActive(item.href)
                      ? "text-rhino-red bg-rhino-red/10 border-l-4 border-rhino-red"
                      : "text-rhino-blue hover:text-rhino-red hover:bg-gray-100"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Admin Panel Link for authenticated users */}
              {user && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 animate-in slide-in-from-right ${
                    location.pathname.startsWith('/admin')
                      ? "text-rhino-red bg-rhino-red/10 border-l-4 border-rhino-red"
                      : "text-rhino-blue hover:text-rhino-red hover:bg-gray-100"
                  }`}
                  style={{ animationDelay: `${navigation.length * 50}ms` }}
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <p className="text-sm text-rhino-gray text-center">
              © 2024 Nepalese Rhinos FC
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
