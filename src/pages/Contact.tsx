
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const ContactPage = () => {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      <Contact />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default ContactPage;
