
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  Users, 
  Calendar, 
  Image, 
  FileText, 
  MessageSquare, 
  Settings,
  Trophy,
  UserCheck,
  MapPin,
  LogOut
} from 'lucide-react';

const AdminLayout = () => {
  const { signOut, profile, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'News & Updates', href: '/admin/announcements', icon: FileText },
    { name: 'Players', href: '/admin/players', icon: Users },
    { name: 'Fixtures', href: '/admin/fixtures', icon: Calendar },
    { name: 'Gallery', href: '/admin/gallery', icon: Image },
    { name: 'Sponsors', href: '/admin/sponsors', icon: Trophy },
    { name: 'Contact Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Events', href: '/admin/events', icon: MapPin },
    ...(isAdmin ? [
      { name: 'User Management', href: '/admin/users', icon: UserCheck },
      { name: 'Settings', href: '/admin/settings', icon: Settings }
    ] : [])
  ];

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-rhino-blue text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-rhino-blue">
                    Admin Panel
                  </h2>
                </div>
                <nav className="flex flex-col gap-1 p-4 pt-0">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>
            <Link to="/admin" className="text-xl font-bold text-rhino-blue">
              Nepalese Rhinos FC - Admin
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {profile?.full_name || profile?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r">
          <nav className="flex flex-col gap-1 p-4">
            <NavItems />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
