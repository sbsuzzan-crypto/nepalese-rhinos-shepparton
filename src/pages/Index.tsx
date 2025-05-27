
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NextMatch from "@/components/NextMatch";
import LatestNews from "@/components/LatestNews";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <NextMatch />
      <LatestNews />
      <Sponsors />
      <Footer />
    </div>
  );
};

export default Index;
