
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
  Settings,
  UserCheck,
  Shield
} from 'lucide-react';

const AdminLayout = () => {
  const { user, profile, signOut, isAdmin, isModerator, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rhino-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
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
                <strong>Status:</strong> <span className="text-yellow-600">Pending Approval</span>
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

  // Add admin-only navigation items
  if (isAdmin) {
    navigation.push(
      {
        name: 'Staff',
        href: '/admin/staff',
        icon: Users,
        current: location.pathname === '/admin/staff'
      },
      {
        name: 'Users',
        href: '/admin/users',
        icon: UserCheck,
        current: location.pathname === '/admin/users'
      }
    );
  }

  const Sidebar = ({ className = '' }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center gap-3 p-6 border-b bg-gradient-to-r from-rhino-red to-red-700">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
          <span className="text-rhino-red font-bold text-lg">NR</span>
        </div>
        <div className="text-white">
          <h2 className="font-bold text-lg">Nepalese Rhinos</h2>
          <p className="text-xs text-red-100">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-4 bg-white">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  item.current
                    ? 'bg-rhino-red text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-rhino-red'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
                {item.name === 'Users' && isAdmin && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Admin
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow-sm">
          <div className="w-10 h-10 bg-gradient-to-br from-rhino-red to-red-700 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">
              {profile?.full_name || user.email}
            </p>
            <div className="flex items-center gap-2">
              <Badge 
                variant={profile?.role === 'admin' ? 'destructive' : 'secondary'} 
                className="text-xs"
              >
                {profile?.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                {profile?.role}
              </Badge>
              {isAdmin && (
                <Badge className="text-xs bg-green-600">
                  Super Admin
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button
          onClick={() => signOut()}
          variant="outline"
          size="sm"
          className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200"
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
            className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md hover:bg-gray-50"
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
        <div className="flex flex-col bg-white border-r border-gray-200 h-full shadow-lg">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
