
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
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

const AdminRoutes = () => {
  return (
    <Routes>
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
    </Routes>
  );
};

export default AdminRoutes;
