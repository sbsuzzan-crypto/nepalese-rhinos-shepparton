
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { queryClient } from "./lib/queryClient";

// Public pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Teams from "@/pages/Teams";
import Fixtures from "@/pages/Fixtures";
import Gallery from "@/pages/Gallery";
import AllGallery from "@/pages/AllGallery";
import GalleryPage from "@/pages/GalleryPage";
import Contact from "@/pages/Contact";
import JoinUs from "@/pages/JoinUs";
import AllNews from "@/pages/AllNews";
import NewsArticle from "@/pages/NewsArticle";
import BecomeASponsor from "@/pages/BecomeASponsor";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

// Admin pages
import Dashboard from "@/pages/admin/Dashboard";
import NewsManagement from "@/pages/admin/NewsManagement";
import TeamsManagement from "@/pages/admin/TeamsManagement";
import PlayersManagement from "@/pages/admin/PlayersManagement";
import StaffManagement from "@/pages/admin/StaffManagement";
import FixturesManagement from "@/pages/admin/FixturesManagement";
import GalleryManagement from "@/pages/admin/GalleryManagement";
import EventsManagement from "@/pages/admin/EventsManagement";
import AnnouncementsManagement from "@/pages/admin/AnnouncementsManagement";
import DocumentsManagement from "@/pages/admin/DocumentsManagement";
import SponsorsManagement from "@/pages/admin/SponsorsManagement";
import UserManagement from "@/pages/admin/UserManagement";
import MessagesManagement from "@/pages/admin/MessagesManagement";
import ContactSubmissionsManagement from "@/pages/admin/ContactSubmissionsManagement";
import JoinSubmissionsManagement from "@/pages/admin/JoinSubmissionsManagement";
import SupportersMessagesManagement from "@/pages/admin/SupportersMessagesManagement";
import SiteSettingsManagement from "@/pages/admin/SiteSettingsManagement";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/fixtures" element={<Fixtures />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/all-gallery" element={<AllGallery />} />
                <Route path="/gallery/:id" element={<GalleryPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/join-us" element={<JoinUs />} />
                <Route path="/all-news" element={<AllNews />} />
                <Route path="/news/:id" element={<NewsArticle />} />
                <Route path="/become-a-sponsor" element={<BecomeASponsor />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Admin Routes - Protected */}
                <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/news" element={<ProtectedRoute><NewsManagement /></ProtectedRoute>} />
                <Route path="/admin/teams" element={<ProtectedRoute><TeamsManagement /></ProtectedRoute>} />
                <Route path="/admin/players" element={<ProtectedRoute><PlayersManagement /></ProtectedRoute>} />
                <Route path="/admin/staff" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />
                <Route path="/admin/fixtures" element={<ProtectedRoute><FixturesManagement /></ProtectedRoute>} />
                <Route path="/admin/gallery" element={<ProtectedRoute><GalleryManagement /></ProtectedRoute>} />
                <Route path="/admin/events" element={<ProtectedRoute><EventsManagement /></ProtectedRoute>} />
                <Route path="/admin/announcements" element={<ProtectedRoute><AnnouncementsManagement /></ProtectedRoute>} />
                <Route path="/admin/documents" element={<ProtectedRoute><DocumentsManagement /></ProtectedRoute>} />
                <Route path="/admin/sponsors" element={<ProtectedRoute><SponsorsManagement /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                <Route path="/admin/messages" element={<ProtectedRoute><MessagesManagement /></ProtectedRoute>} />
                <Route path="/admin/contact-submissions" element={<ProtectedRoute><ContactSubmissionsManagement /></ProtectedRoute>} />
                <Route path="/admin/join-submissions" element={<ProtectedRoute><JoinSubmissionsManagement /></ProtectedRoute>} />
                <Route path="/admin/supporters-messages" element={<ProtectedRoute><SupportersMessagesManagement /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute><SiteSettingsManagement /></ProtectedRoute>} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
