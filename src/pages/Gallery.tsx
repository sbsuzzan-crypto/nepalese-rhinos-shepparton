
import Header from "@/components/Header";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const GalleryPage = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      <Gallery />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default GalleryPage;
