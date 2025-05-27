
import { 
  Home, 
  FileText, 
  Users, 
  Calendar, 
  Image, 
  Trophy,
  MessageSquare,
  Settings,
  UserCheck,
  Megaphone,
  CalendarDays,
  Heart,
  FolderOpen
} from 'lucide-react';

export const getNavigationItems = (location: { pathname: string }, userRole: string) => {
  const baseNavigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      current: location.pathname === '/admin',
      roles: ['admin', 'moderator']
    },
    {
      name: 'News',
      href: '/admin/news',
      icon: FileText,
      current: location.pathname === '/admin/news',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Announcements',
      href: '/admin/announcements',
      icon: Megaphone,
      current: location.pathname === '/admin/announcements',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: CalendarDays,
      current: location.pathname === '/admin/events',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Players',
      href: '/admin/players',
      icon: Users,
      current: location.pathname === '/admin/players',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Teams',
      href: '/admin/teams',
      icon: Users,
      current: location.pathname === '/admin/teams',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Fixtures',
      href: '/admin/fixtures',
      icon: Calendar,
      current: location.pathname === '/admin/fixtures',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Gallery',
      href: '/admin/gallery',
      icon: Image,
      current: location.pathname === '/admin/gallery',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Sponsors',
      href: '/admin/sponsors',
      icon: Trophy,
      current: location.pathname === '/admin/sponsors',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
      current: location.pathname === '/admin/messages',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Supporters',
      href: '/admin/supporters-messages',
      icon: Heart,
      current: location.pathname === '/admin/supporters-messages',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Join Requests',
      href: '/admin/join-submissions',
      icon: UserCheck,
      current: location.pathname === '/admin/join-submissions',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Contact Forms',
      href: '/admin/contact-submissions',
      icon: MessageSquare,
      current: location.pathname === '/admin/contact-submissions',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Documents',
      href: '/admin/documents',
      icon: FolderOpen,
      current: location.pathname === '/admin/documents',
      roles: ['admin', 'moderator']
    },
    {
      name: 'Site Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings',
      roles: ['admin']
    },
    {
      name: 'Staff',
      href: '/admin/staff',
      icon: Users,
      current: location.pathname === '/admin/staff',
      roles: ['admin']
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: UserCheck,
      current: location.pathname === '/admin/users',
      roles: ['admin']
    }
  ];

  return baseNavigation.filter(item => item.roles.includes(userRole));
};
