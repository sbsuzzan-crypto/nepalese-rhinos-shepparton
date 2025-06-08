
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Phone, 
  Share2, 
  Palette, 
  Search,
  Shield,
  Smartphone,
  BarChart3,
  Zap,
  Users
} from 'lucide-react';

const SettingsTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-6 lg:grid-cols-10">
      <TabsTrigger value="general" className="flex items-center gap-1">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">General</span>
      </TabsTrigger>
      <TabsTrigger value="branding" className="flex items-center gap-1">
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">Branding</span>
      </TabsTrigger>
      <TabsTrigger value="club" className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        <span className="hidden sm:inline">Club</span>
      </TabsTrigger>
      <TabsTrigger value="features" className="flex items-center gap-1">
        <Zap className="w-4 h-4" />
        <span className="hidden sm:inline">Features</span>
      </TabsTrigger>
      <TabsTrigger value="communication" className="flex items-center gap-1">
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">Comm</span>
      </TabsTrigger>
      <TabsTrigger value="analytics" className="flex items-center gap-1">
        <BarChart3 className="w-4 h-4" />
        <span className="hidden sm:inline">Analytics</span>
      </TabsTrigger>
      <TabsTrigger value="security" className="flex items-center gap-1">
        <Shield className="w-4 h-4" />
        <span className="hidden sm:inline">Security</span>
      </TabsTrigger>
      <TabsTrigger value="mobile" className="flex items-center gap-1">
        <Smartphone className="w-4 h-4" />
        <span className="hidden sm:inline">Mobile</span>
      </TabsTrigger>
      <TabsTrigger value="social" className="flex items-center gap-1">
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Social</span>
      </TabsTrigger>
      <TabsTrigger value="seo" className="flex items-center gap-1">
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">SEO</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default SettingsTabsList;
