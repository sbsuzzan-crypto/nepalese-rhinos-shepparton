
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
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
                
                {/* Admin Routes - All wrapped with AdminLayout */}
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="news" element={<NewsManagement />} />
                  <Route path="teams" element={<TeamsManagement />} />
                  <Route path="players" element={<PlayersManagement />} />
                  <Route path="staff" element={<StaffManagement />} />
                  <Route path="fixtures" element={<FixturesManagement />} />
                  <Route path="gallery" element={<GalleryManagement />} />
                  <Route path="events" element={<EventsManagement />} />
                  <Route path="announcements" element={<AnnouncementsManagement />} />
                  <Route path="documents" element={<DocumentsManagement />} />
                  <Route path="sponsors" element={<SponsorsManagement />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="messages" element={<MessagesManagement />} />
                  <Route path="contact-submissions" element={<ContactSubmissionsManagement />} />
                  <Route path="join-submissions" element={<JoinSubmissionsManagement />} />
                  <Route path="supporters-messages" element={<SupportersMessagesManagement />} />
                  <Route path="settings" element={<SiteSettingsManagement />} />
                </Route>
                
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
