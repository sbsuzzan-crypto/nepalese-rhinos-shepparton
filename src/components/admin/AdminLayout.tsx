
import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Home, 
  FileText, 
  Users, 
  Calendar, 
  Image, 
  Trophy,
  MessageSquare,
  LogOut,
  Settings
} from 'lucide-react';

const AdminLayout = () => {
  const { user, profile, signOut, isAdmin, isModerator, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rhino-red mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show approval pending message if user is not approved
  if (!profile?.is_approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
            <p className="text-gray-600">
              Your account has been created successfully, but it needs to be approved by an administrator before you can access the admin panel.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Role:</strong> {profile?.role || 'Pending'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Status:</strong> Pending Approval
              </p>
            </div>
            <Button 
              onClick={() => signOut()} 
              variant="outline" 
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      current: location.pathname === '/admin'
    },
    {
      name: 'News',
      href: '/admin/news',
      icon: FileText,
      current: location.pathname === '/admin/news'
    },
    {
      name: 'Players',
      href: '/admin/players',
      icon: Users,
      current: location.pathname === '/admin/players'
    },
    {
      name: 'Fixtures',
      href: '/admin/fixtures',
      icon: Calendar,
      current: location.pathname === '/admin/fixtures'
    },
    {
      name: 'Gallery',
      href: '/admin/gallery',
      icon: Image,
      current: location.pathname === '/admin/gallery'
    },
    {
      name: 'Sponsors',
      href: '/admin/sponsors',
      icon: Trophy,
      current: location.pathname === '/admin/sponsors'
    },
    {
      name: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
      current: location.pathname === '/admin/messages'
    }
  ];

  const Sidebar = ({ className = '' }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center gap-2 p-6 border-b">
        <div className="w-8 h-8 bg-rhino-red rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">NR</span>
        </div>
        <div>
          <h2 className="font-bold text-lg">Nepalese Rhinos</h2>
          <p className="text-sm text-gray-600">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-rhino-red text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{profile?.full_name || user.email}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {profile?.role}
              </Badge>
              {isAdmin && <Badge className="text-xs bg-rhino-red">Admin</Badge>}
            </div>
          </div>
        </div>
        <Button
          onClick={() => signOut()}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col bg-white border-r border-gray-200 h-full">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
