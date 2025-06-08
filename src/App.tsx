
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Teams from "./pages/Teams";
import Fixtures from "./pages/Fixtures";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import JoinUs from "./pages/JoinUs";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AllGallery from "./pages/AllGallery";
import GalleryPage from "./pages/GalleryPage";
import NewsArticle from "./pages/NewsArticle";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import NewsManagement from "./pages/admin/NewsManagement";
import PlayersManagement from "./pages/admin/PlayersManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import FixturesManagement from "./pages/admin/FixturesManagement";
import GalleryManagement from "./pages/admin/GalleryManagement";
import SponsorsManagement from "./pages/admin/SponsorsManagement";
import EventsManagement from "./pages/admin/EventsManagement";
import AnnouncementsManagement from "./pages/admin/AnnouncementsManagement";
import ContactSubmissionsManagement from "./pages/admin/ContactSubmissionsManagement";
import JoinSubmissionsManagement from "./pages/admin/JoinSubmissionsManagement";
import SupportersMessagesManagement from "./pages/admin/SupportersMessagesManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import DocumentsManagement from "./pages/admin/DocumentsManagement";
import UserManagement from "./pages/admin/UserManagement";
import SiteSettingsManagement from "./pages/admin/SiteSettingsManagement";
import TeamsManagement from "./pages/admin/TeamsManagement";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/all-gallery" element={<AllGallery />} />
            <Route path="/gallery-page" element={<GalleryPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/news/:id" element={<NewsArticle />} />
            
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="news" element={<NewsManagement />} />
              <Route path="players" element={<PlayersManagement />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="teams" element={<TeamsManagement />} />
              <Route path="fixtures" element={<FixturesManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="sponsors" element={<SponsorsManagement />} />
              <Route path="events" element={<EventsManagement />} />
              <Route path="announcements" element={<AnnouncementsManagement />} />
              <Route path="contact-submissions" element={<ContactSubmissionsManagement />} />
              <Route path="join-submissions" element={<JoinSubmissionsManagement />} />
              <Route path="supporters-messages" element={<SupportersMessagesManagement />} />
              <Route path="messages" element={<MessagesManagement />} />
              <Route path="documents" element={<DocumentsManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<SiteSettingsManagement />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
