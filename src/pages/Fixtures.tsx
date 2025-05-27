
import Header from "@/components/Header";
import Fixtures from "@/components/Fixtures";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const FixturesPage = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      <Fixtures />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default FixturesPage;
