
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Image, 
  FileText,
  Trophy,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { profile, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    news: 0,
    players: 0,
    fixtures: 0,
    gallery: 0,
    messages: 0,
    sponsors: 0
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
          { count: sponsorsCount }
        ] = await Promise.all([
          supabase.from('news').select('*', { count: 'exact', head: true }),
          supabase.from('players').select('*', { count: 'exact', head: true }),
          supabase.from('fixtures').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
          supabase.from('sponsors').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          news: newsCount || 0,
          players: playersCount || 0,
          fixtures: fixturesCount || 0,
          gallery: galleryCount || 0,
          messages: messagesCount || 0,
          sponsors: sponsorsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Add News',
      description: 'Create a new news article',
      href: '/admin/news',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Add Player',
      description: 'Register a new player',
      href: '/admin/players',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Add Fixture',
      description: 'Schedule a new match',
      href: '/admin/fixtures',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Upload Photos',
      description: 'Add images to gallery',
      href: '/admin/gallery',
      icon: Image,
      color: 'bg-orange-500'
    }
  ];

  const statsCards = [
    {
      title: 'News Articles',
      value: stats.news,
      icon: FileText,
      href: '/admin/news',
      color: 'text-blue-600'
    },
    {
      title: 'Players',
      value: stats.players,
      icon: Users,
      href: '/admin/players',
      color: 'text-green-600'
    },
    {
      title: 'Fixtures',
      value: stats.fixtures,
      icon: Calendar,
      href: '/admin/fixtures',
      color: 'text-purple-600'
    },
    {
      title: 'Gallery Photos',
      value: stats.gallery,
      icon: Image,
      href: '/admin/gallery',
      color: 'text-orange-600'
    },
    {
      title: 'Messages',
      value: stats.messages,
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'text-red-600'
    },
    {
      title: 'Sponsors',
      value: stats.sponsors,
      icon: Trophy,
      href: '/admin/sponsors',
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your football club website content from here.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Content Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsCards.map((stat) => (
            <Link key={stat.title} to={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* User Role Information */}
      <Card>
        <CardHeader>
          <CardTitle>Your Access Level</CardTitle>
          <CardDescription>
            Current role: <span className="font-medium capitalize">{profile?.role}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>✅ Create and manage content</p>
            <p>✅ View contact messages</p>
            <p>✅ Upload gallery images</p>
            {isAdmin && (
              <>
                <p>✅ Manage user accounts</p>
                <p>✅ Access site settings</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
