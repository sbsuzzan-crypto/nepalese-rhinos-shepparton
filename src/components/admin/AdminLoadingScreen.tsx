
import { Loader2, Shield } from 'lucide-react';

const AdminLoadingScreen = () => {
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
};

export default AdminLoadingScreen;
