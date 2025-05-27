
import Header from "@/components/Header";
import About from "@/components/About";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const AboutPage = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      <About />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default AboutPage;
