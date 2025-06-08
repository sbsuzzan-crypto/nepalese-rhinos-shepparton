
import { Routes, Route } from "react-router-dom";
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

const PublicRoutes = () => {
  return (
    <Routes>
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default PublicRoutes;
