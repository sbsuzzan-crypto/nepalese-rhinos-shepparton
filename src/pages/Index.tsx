
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import NextMatch from "@/components/NextMatch";
import LatestNews from "@/components/LatestNews";
import FanPoll from "@/components/FanPoll";
import NewsletterSubscription from "@/components/NewsletterSubscription";
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
      
      {/* Fan Engagement Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-rhino-blue mb-4">Fan Engagement</h2>
              <p className="text-lg text-rhino-gray">Join the conversation and stay connected with your club</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <FanPoll />
              <NewsletterSubscription />
            </div>
          </div>
        </div>
      </section>
      
      <Sponsors />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
