
import { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import AdminLoadingScreen from './AdminLoadingScreen';
import AdminPendingApproval from './AdminPendingApproval';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const { user, profile, signOut, isAdmin, isModerator, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading state while checking authentication
  if (loading) {
    return <AdminLoadingScreen />;
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show approval pending message if user is not approved
  if (!profile?.is_approved) {
    return (
      <AdminPendingApproval 
        user={user}
        profile={profile}
        signOut={signOut}
      />
    );
  }

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
          <AdminSidebar 
            location={location}
            profile={profile}
            user={user}
            signOut={signOut}
            isAdmin={isAdmin}
            setSidebarOpen={setSidebarOpen}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col bg-white border-r border-slate-200 h-full shadow-xl">
          <AdminSidebar 
            location={location}
            profile={profile}
            user={user}
            signOut={signOut}
            isAdmin={isAdmin}
            setSidebarOpen={setSidebarOpen}
          />
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
