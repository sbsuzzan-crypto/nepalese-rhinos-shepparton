
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NextMatch from "@/components/NextMatch";
import LatestNews from "@/components/LatestNews";
import About from "@/components/About";
import Teams from "@/components/Teams";
import Fixtures from "@/components/Fixtures";
import Gallery from "@/components/Gallery";
import JoinUs from "@/components/JoinUs";
import Sponsors from "@/components/Sponsors";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <NextMatch />
      <LatestNews />
      <About />
      <Teams />
      <Fixtures />
      <Gallery />
      <JoinUs />
      <Sponsors />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
