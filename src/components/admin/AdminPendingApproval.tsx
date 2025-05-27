
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, LogOut, Loader2 } from 'lucide-react';

interface AdminPendingApprovalProps {
  user: any;
  profile: any;
  signOut: () => Promise<void>;
}

const AdminPendingApproval = ({ user, profile, signOut }: AdminPendingApprovalProps) => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-slate-200">
        <div className="mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rhino-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
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
                <Badge variant="pending" className="text-xs">
                  Pending Approval
                </Badge>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSignOut}
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
};

export default AdminPendingApproval;
