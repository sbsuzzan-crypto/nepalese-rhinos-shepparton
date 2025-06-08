
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  // Only show auth button if user is authenticated
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="text-rhino-red hover:text-red-700">
            <Shield className="h-4 w-4 mr-2" />
            Admin Panel
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => signOut()}
          className="text-slate-600 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  // Don't show anything for unauthenticated users
  return null;
};

export default AuthButton;
