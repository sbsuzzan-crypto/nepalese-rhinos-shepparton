
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NextMatch from "@/components/NextMatch";
import LatestNews from "@/components/LatestNews";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <SEOHead
        title="Home"
        description="Welcome to Nepalese Rhinos FC - A passionate football community in Shepparton bringing together Nepalese heritage and Australian spirit."
      />
      <Header />
      <Hero />
      <NextMatch />
      <LatestNews />
      <Sponsors />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
