
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Teams from "./pages/Teams";
import Fixtures from "./pages/Fixtures";
import Gallery from "./pages/Gallery";
import JoinUs from "./pages/JoinUs";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import NewsManagement from "./pages/admin/NewsManagement";
import PlayersManagement from "./pages/admin/PlayersManagement";
import FixturesManagement from "./pages/admin/FixturesManagement";
import GalleryManagement from "./pages/admin/GalleryManagement";
import SponsorsManagement from "./pages/admin/SponsorsManagement";
import MessagesManagement from "./pages/admin/MessagesManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import UserManagement from "./pages/admin/UserManagement";
import AnnouncementsManagement from "./pages/admin/AnnouncementsManagement";
import EventsManagement from "./pages/admin/EventsManagement";
import TeamsManagement from "./pages/admin/TeamsManagement";
import JoinSubmissionsManagement from "./pages/admin/JoinSubmissionsManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/join-us" element={<JoinUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="news" element={<NewsManagement />} />
              <Route path="announcements" element={<AnnouncementsManagement />} />
              <Route path="events" element={<EventsManagement />} />
              <Route path="players" element={<PlayersManagement />} />
              <Route path="teams" element={<TeamsManagement />} />
              <Route path="fixtures" element={<FixturesManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="sponsors" element={<SponsorsManagement />} />
              <Route path="messages" element={<MessagesManagement />} />
              <Route path="join-submissions" element={<JoinSubmissionsManagement />} />
              <Route 
                path="staff" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <StaffManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="users" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
