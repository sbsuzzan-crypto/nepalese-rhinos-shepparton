
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Image, 
  FileText,
  Trophy,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import DashboardCard from '@/components/admin/DashboardCard';
import QuickActionCard from '@/components/admin/QuickActionCard';

const Dashboard = () => {
  const { profile, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    news: 0,
    players: 0,
    fixtures: 0,
    gallery: 0,
    messages: 0,
    sponsors: 0,
    staff: 0,
    pendingUsers: 0,
    approvedUsers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: newsCount },
          { count: playersCount },
          { count: fixturesCount },
          { count: galleryCount },
          { count: messagesCount },
          { count: sponsorsCount },
          { count: staffCount },
          { data: profiles }
        ] = await Promise.all([
          supabase.from('news').select('*', { count: 'exact', head: true }),
          supabase.from('players').select('*', { count: 'exact', head: true }),
          supabase.from('fixtures').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
          supabase.from('sponsors').select('*', { count: 'exact', head: true }),
          supabase.from('staff').select('*', { count: 'exact', head: true }),
          supabase.from('profiles').select('*')
        ]);

        const pendingUsers = profiles?.filter(p => !p.is_approved).length || 0;
        const approvedUsers = profiles?.filter(p => p.is_approved).length || 0;

        setStats({
          news: newsCount || 0,
          players: playersCount || 0,
          fixtures: fixturesCount || 0,
          gallery: galleryCount || 0,
          messages: messagesCount || 0,
          sponsors: sponsorsCount || 0,
          staff: staffCount || 0,
          pendingUsers,
          approvedUsers
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Create News Article',
      description: 'Share the latest club news and match reports with supporters',
      href: '/admin/news',
      icon: FileText,
      color: 'bg-blue-600'
    },
    {
      title: 'Add Player',
      description: 'Register new squad members and update player profiles',
      href: '/admin/players',
      icon: Users,
      color: 'bg-emerald-600'
    },
    {
      title: 'Schedule Fixture',
      description: 'Add upcoming matches and update fixture information',
      href: '/admin/fixtures',
      icon: Calendar,
      color: 'bg-purple-600'
    },
    {
      title: 'Upload Gallery',
      description: 'Add match photos and team moments to the gallery',
      href: '/admin/gallery',
      icon: Image,
      color: 'bg-orange-600'
    }
  ];

  const statsCards = [
    {
      title: 'News Articles',
      value: stats.news,
      icon: FileText,
      href: '/admin/news',
      color: 'bg-blue-600',
      description: 'Published articles',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Active Players',
      value: stats.players,
      icon: Users,
      href: '/admin/players',
      color: 'bg-emerald-600',
      description: 'Squad members',
      iconBg: 'bg-emerald-100'
    },
    {
      title: 'Fixtures',
      value: stats.fixtures,
      icon: Calendar,
      href: '/admin/fixtures',
      color: 'bg-purple-600',
      description: 'Total matches',
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Gallery Photos',
      value: stats.gallery,
      icon: Image,
      href: '/admin/gallery',
      color: 'bg-orange-600',
      description: 'Media uploads',
      iconBg: 'bg-orange-100'
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'bg-red-600',
      description: 'Contact inquiries',
      iconBg: 'bg-red-100'
    },
    {
      title: 'Sponsors',
      value: stats.sponsors,
      icon: Trophy,
      href: '/admin/sponsors',
      color: 'bg-amber-600',
      description: 'Active partnerships',
      iconBg: 'bg-amber-100'
    }
  ];

  if (isAdmin) {
    statsCards.push(
      {
        title: 'Staff Members',
        value: stats.staff,
        icon: Users,
        href: '/admin/staff',
        color: 'bg-indigo-600',
        description: 'Team personnel',
        iconBg: 'bg-indigo-100'
      },
      {
        title: 'Pending Approvals',
        value: stats.pendingUsers,
        icon: UserX,
        href: '/admin/users',
        color: 'bg-rose-600',
        description: 'Awaiting approval',
        iconBg: 'bg-rose-100'
      }
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rhino-red to-red-700 rounded-lg p-6 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Welcome back, {profile?.full_name || 'Admin'}!
        </h1>
        <p className="text-red-100">
          Manage your football club website from this central dashboard.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-white" />
            <span className="text-sm text-white">System Status: Online</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-white" />
            <span className="text-sm text-white">All services operational</span>
          </div>
        </div>
      </div>

      {/* System Status Alert */}
      <Alert variant="default" className="border-emerald-200 bg-emerald-50">
        <CheckCircle className="h-4 w-4 text-emerald-600" />
        <AlertDescription className="text-emerald-800">
          All systems are running smoothly. Your website is online and accessible to visitors.
        </AlertDescription>
      </Alert>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* Statistics Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <DashboardCard key={stat.title} {...stat} />
          ))}
        </div>
      </div>

      {/* Admin Features */}
      {isAdmin && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-rhino-blue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-rhino-blue" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts and approval requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Approved Users:</span>
                    <span className="font-medium text-emerald-600">{stats.approvedUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Approval:</span>
                    <span className="font-medium text-orange-600">{stats.pendingUsers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Staff Management
                </CardTitle>
                <CardDescription>
                  Manage coaching staff and team personnel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Staff:</span>
                    <span className="font-medium">{stats.staff}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Access:</span>
                    <span className="font-medium text-emerald-600">Full Control</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* User Role Information */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-900">Your Access Level</CardTitle>
          <CardDescription>
            Current role: <span className="font-medium capitalize text-rhino-red">{profile?.role}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Content Management</h4>
              <p className="text-emerald-600">✅ Create and edit news articles</p>
              <p className="text-emerald-600">✅ Manage player profiles</p>
              <p className="text-emerald-600">✅ Update fixtures and results</p>
              <p className="text-emerald-600">✅ Upload gallery images</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Communication</h4>
              <p className="text-emerald-600">✅ View contact messages</p>
              <p className="text-emerald-600">✅ Manage sponsor information</p>
              {isAdmin && (
                <>
                  <p className="text-emerald-600">✅ Approve user accounts</p>
                  <p className="text-emerald-600">✅ Manage staff members</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
