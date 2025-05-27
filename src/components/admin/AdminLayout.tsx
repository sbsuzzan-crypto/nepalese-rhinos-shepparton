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
  FolderOpen,
  Loader2
} from 'lucide-react';

const AdminLayout = () => {
  const { user, profile, signOut, isAdmin, isModerator, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-rhino-red to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-rhino-red mx-auto mb-4" />
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
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-slate-200">
          <div className="mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Account Pending Approval</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Your account has been created successfully, but it needs to be approved by an administrator before you can access the admin panel.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-medium text-slate-900 truncate ml-2">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Role:</span>
                  <span className="font-medium text-slate-900">{profile?.role || 'Pending'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Status:</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                    Pending Approval
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={async () => {
                setIsSigningOut(true);
                await signOut();
              }}
              disabled={isSigningOut}
              variant="outline" 
              className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Define navigation items with role-based access control
  const baseNavigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      current: location.pathname === '/admin',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'News',
      href: '/admin/news',
      icon: FileText,
      current: location.pathname === '/admin/news',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Announcements',
      href: '/admin/announcements',
      icon: Megaphone,
      current: location.pathname === '/admin/announcements',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: CalendarDays,
      current: location.pathname === '/admin/events',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Players',
      href: '/admin/players',
      icon: Users,
      current: location.pathname === '/admin/players',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Teams',
      href: '/admin/teams',
      icon: Users,
      current: location.pathname === '/admin/teams',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Fixtures',
      href: '/admin/fixtures',
      icon: Calendar,
      current: location.pathname === '/admin/fixtures',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Gallery',
      href: '/admin/gallery',
      icon: Image,
      current: location.pathname === '/admin/gallery',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Sponsors',
      href: '/admin/sponsors',
      icon: Trophy,
      current: location.pathname === '/admin/sponsors',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
      current: location.pathname === '/admin/messages',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Supporters',
      href: '/admin/supporters-messages',
      icon: Heart,
      current: location.pathname === '/admin/supporters-messages',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Join Requests',
      href: '/admin/join-submissions',
      icon: UserCheck,
      current: location.pathname === '/admin/join-submissions',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Contact Forms',
      href: '/admin/contact-submissions',
      icon: MessageSquare,
      current: location.pathname === '/admin/contact-submissions',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Documents',
      href: '/admin/documents',
      icon: FolderOpen,
      current: location.pathname === '/admin/documents',
      roles: ['admin', 'moderator'] // Both can access
    },
    {
      name: 'Site Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings',
      roles: ['admin'] // Admin only
    },
    {
      name: 'Staff',
      href: '/admin/staff',
      icon: Users,
      current: location.pathname === '/admin/staff',
      roles: ['admin'] // Admin only
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: UserCheck,
      current: location.pathname === '/admin/users',
      roles: ['admin'] // Admin only
    }
  ];

  // Filter navigation based on user role
  const navigation = baseNavigation.filter(item => {
    const userRole = profile?.role;
    return item.roles.includes(userRole as string);
  });

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      // Force redirect even if there's an error
      window.location.href = '/auth';
    } finally {
      setIsSigningOut(false);
    }
  };

  const Sidebar = ({ className = '' }: { className?: string }) => (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center gap-3 p-4 sm:p-6 border-b bg-gradient-to-r from-rhino-red to-red-700">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-rhino-red font-bold text-lg sm:text-xl">NR</span>
        </div>
        <div className="text-white min-w-0 flex-1">
          <h2 className="font-bold text-base sm:text-lg truncate">Nepalese Rhinos</h2>
          <p className="text-xs text-red-100">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-3 sm:p-4 bg-white overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  item.current
                    ? 'bg-gradient-to-r from-rhino-red to-red-700 text-white shadow-lg scale-105'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-rhino-red hover:scale-105'
                }`}
              >
                <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${item.current ? 'text-white' : 'text-slate-400 group-hover:text-rhino-red'}`} />
                <span className="truncate">{item.name}</span>
                {item.roles.includes('admin') && item.roles.length === 1 && (
                  <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-800 hidden sm:inline-flex">
                    Admin
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 sm:p-4 border-t bg-slate-50">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 p-2 sm:p-3 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rhino-red to-red-700 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-slate-900 truncate">
              {profile?.full_name || user.email}
            </p>
            <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
              <Badge 
                variant={profile?.role === 'admin' ? 'destructive' : 'secondary'} 
                className="text-xs"
              >
                {profile?.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                {profile?.role}
              </Badge>
              {isAdmin && (
                <Badge className="text-xs bg-green-600 hover:bg-green-700 hidden sm:inline-flex">
                  Super Admin
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          disabled={isSigningOut}
          variant="outline"
          size="sm"
          className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 text-sm"
        >
          {isSigningOut ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="hidden sm:inline">Signing Out...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Out</span>
            </>
          )}
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
        <SheetContent side="left" className="w-72 sm:w-80 p-0">
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
        <main className="py-6 sm:py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
