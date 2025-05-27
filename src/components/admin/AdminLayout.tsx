
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
  Shield,
  Megaphone,
  CalendarDays,
  Heart,
  FolderOpen
} from 'lucide-react';

const AdminLayout = () => {
  const { user, profile, signOut, isAdmin, isModerator, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-rhino-red to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rhino-red mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading admin panel...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Account Pending Approval</h2>
            <p className="text-slate-600 leading-relaxed">
              Your account has been created successfully, but it needs to be approved by an administrator before you can access the admin panel.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-medium text-slate-900">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Role:</span>
                  <span className="font-medium text-slate-900">{profile?.role || 'Pending'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Pending Approval
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={signOut} 
              variant="outline" 
              className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
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
      name: 'Announcements',
      href: '/admin/announcements',
      icon: Megaphone,
      current: location.pathname === '/admin/announcements'
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: CalendarDays,
      current: location.pathname === '/admin/events'
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
    },
    {
      name: 'Supporters',
      href: '/admin/supporters-messages',
      icon: Heart,
      current: location.pathname === '/admin/supporters-messages'
    },
    {
      name: 'Join Requests',
      href: '/admin/join-submissions',
      icon: UserCheck,
      current: location.pathname === '/admin/join-submissions'
    },
    {
      name: 'Contact Forms',
      href: '/admin/contact-submissions',
      icon: MessageSquare,
      current: location.pathname === '/admin/contact-submissions'
    },
    {
      name: 'Documents',
      href: '/admin/documents',
      icon: FolderOpen,
      current: location.pathname === '/admin/documents'
    },
    {
      name: 'Site Settings',
      href: '/admin/site-settings',
      icon: Settings,
      current: location.pathname === '/admin/site-settings'
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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      // Force redirect even if there's an error
      window.location.href = '/auth';
    }
  };

  const Sidebar = ({ className = '' }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center gap-3 p-6 border-b bg-gradient-to-r from-rhino-red to-red-700">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-rhino-red font-bold text-xl">NR</span>
        </div>
        <div className="text-white">
          <h2 className="font-bold text-lg">Nepalese Rhinos</h2>
          <p className="text-xs text-red-100">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-4 bg-white overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  item.current
                    ? 'bg-gradient-to-r from-rhino-red to-red-700 text-white shadow-lg scale-105'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-rhino-red hover:scale-105'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.current ? 'text-white' : 'text-slate-400 group-hover:text-rhino-red'}`} />
                {item.name}
                {item.name === 'Users' && isAdmin && (
                  <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-800">
                    Admin
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t bg-slate-50">
        <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-gradient-to-br from-rhino-red to-red-700 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-slate-900 truncate">
              {profile?.full_name || user.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={profile?.role === 'admin' ? 'destructive' : 'secondary'} 
                className="text-xs"
              >
                {profile?.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                {profile?.role}
              </Badge>
              {isAdmin && (
                <Badge className="text-xs bg-green-600 hover:bg-green-700">
                  Super Admin
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg hover:bg-slate-50 border-slate-200"
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
        <div className="flex flex-col bg-white border-r border-slate-200 h-full shadow-xl">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
