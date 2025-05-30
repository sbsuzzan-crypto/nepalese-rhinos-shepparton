
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { getNavigationItems } from './AdminNavigation';
import AdminUserProfile from './AdminUserProfile';

interface AdminSidebarProps {
  className?: string;
  location: { pathname: string };
  profile: any;
  user: any;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar = ({ 
  className = '', 
  location, 
  profile, 
  user, 
  signOut, 
  isAdmin,
  setSidebarOpen 
}: AdminSidebarProps) => {
  const navigation = getNavigationItems(location, profile?.role);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center gap-3 p-4 sm:p-6 border-b bg-gradient-to-r from-rhino-red to-red-700">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-rhino-red font-bold text-lg sm:text-xl">NR</span>
        </div>
        <div className="text-white min-w-0 flex-1">
          <h2 className="font-bold text-base sm:text-lg truncate text-white">Nepalese Rhinos</h2>
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
                <span className={`truncate ${item.current ? 'text-white' : 'text-slate-700 group-hover:text-rhino-red'}`}>{item.name}</span>
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

      <AdminUserProfile 
        user={user}
        profile={profile}
        signOut={signOut}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default AdminSidebar;
