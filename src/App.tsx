
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Teams from "./pages/Teams";
import Fixtures from "./pages/Fixtures";
import Gallery from "./pages/Gallery";
import AllGallery from "./pages/AllGallery";
import GalleryPage from "./pages/GalleryPage";
import Contact from "./pages/Contact";
import JoinUs from "./pages/JoinUs";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import NewsManagement from "./pages/admin/NewsManagement";
import PlayersManagement from "./pages/admin/PlayersManagement";
import TeamsManagement from "./pages/admin/TeamsManagement";
import FixturesManagement from "./pages/admin/FixturesManagement";
import GalleryManagement from "./pages/admin/GalleryManagement";
import ContactSubmissionsManagement from "./pages/admin/ContactSubmissionsManagement";
import JoinSubmissionsManagement from "./pages/admin/JoinSubmissionsManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import SponsorsManagement from "./pages/admin/SponsorsManagement";
import EventsManagement from "./pages/admin/EventsManagement";
import AnnouncementsManagement from "./pages/admin/AnnouncementsManagement";
import DocumentsManagement from "./pages/admin/DocumentsManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import SupportersMessagesManagement from "./pages/admin/SupportersMessagesManagement";
import UserManagement from "./pages/admin/UserManagement";
import SiteSettingsManagement from "./pages/admin/SiteSettingsManagement";

import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/fixtures" element={<Fixtures />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/all" element={<AllGallery />} />
              <Route path="/gallery/:id" element={<GalleryPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/join" element={<JoinUs />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="news" element={<NewsManagement />} />
                <Route path="players" element={<PlayersManagement />} />
                <Route path="teams" element={<TeamsManagement />} />
                <Route path="fixtures" element={<FixturesManagement />} />
                <Route path="gallery" element={<GalleryManagement />} />
                <Route path="contact-submissions" element={<ContactSubmissionsManagement />} />
                <Route path="join-submissions" element={<JoinSubmissionsManagement />} />
                <Route path="staff" element={<StaffManagement />} />
                <Route path="sponsors" element={<SponsorsManagement />} />
                <Route path="events" element={<EventsManagement />} />
                <Route path="announcements" element={<AnnouncementsManagement />} />
                <Route path="documents" element={<DocumentsManagement />} />
                <Route path="messages" element={<MessagesManagement />} />
                <Route path="supporters-messages" element={<SupportersMessagesManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<SiteSettingsManagement />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
