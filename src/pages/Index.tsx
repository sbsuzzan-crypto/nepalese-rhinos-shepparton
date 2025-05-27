
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NextMatch from "@/components/NextMatch";
import LatestNews from "@/components/LatestNews";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const Index = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
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
