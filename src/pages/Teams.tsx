
import Header from "@/components/Header";
import Teams from "@/components/Teams";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const TeamsPage = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      <Teams />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default TeamsPage;
