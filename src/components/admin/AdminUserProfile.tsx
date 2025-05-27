
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, LogOut, Loader2, Shield } from 'lucide-react';

interface AdminUserProfileProps {
  user: any;
  profile: any;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AdminUserProfile = ({ user, profile, signOut, isAdmin }: AdminUserProfileProps) => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      window.location.href = '/auth';
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
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
              variant={profile?.role === 'admin' ? 'destructive' : 'info'} 
              className="text-xs"
            >
              {profile?.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
              {profile?.role}
            </Badge>
            {isAdmin && (
              <Badge variant="success" className="text-xs hidden sm:inline-flex">
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
  );
};

export default AdminUserProfile;
