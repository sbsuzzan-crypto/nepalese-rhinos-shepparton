
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Award, Trophy, Mail, Phone, Building, Users } from "lucide-react";
import { toast } from "sonner";

const sponsorshipTiers = [
  {
    tier: "Gold",
    price: "$5,000",
    color: "from-amber-400 to-yellow-600",
    icon: Trophy,
    benefits: [
      "Logo on team jerseys",
      "Stadium naming rights",
      "VIP match day experiences",
      "Social media promotion",
      "Website homepage featuring",
      "Corporate hospitality packages",
      "Player meet & greet sessions"
    ]
  },
  {
    tier: "Silver",
    price: "$3,000",
    color: "from-gray-300 to-gray-500",
    icon: Award,
    benefits: [
      "Logo on training gear",
      "Match day announcements",
      "Website sponsor page",
      "Social media mentions",
      "Newsletter inclusions",
      "Community event participation"
    ]
  },
  {
    tier: "Bronze",
    price: "$1,500",
    color: "from-orange-400 to-red-500",
    icon: Star,
    benefits: [
      "Website listing",
      "Match program advertising",
      "Social media recognition",
      "Community newsletter features",
      "Event partnership opportunities"
    ]
  }
];

const BecomeASponsor = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    tier: "",
    message: ""
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: data.contactName,
          email: data.email,
          phone: data.phone || null,
          subject: `Sponsorship Inquiry - ${data.tier} Tier`,
          message: `Company: ${data.companyName}\nInterested Tier: ${data.tier}\n\nMessage:\n${data.message}`
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        tier: "",
        message: ""
      });
      toast.success("Thank you! We'll contact you soon about partnership opportunities.");
    },
    onError: (error) => {
      console.error('Error submitting sponsorship inquiry:', error);
      toast.error("Failed to submit inquiry. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.tier) {
      toast.error("Please fill in all required fields");
      return;
    }

    submitMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <SEOHead
        title="Become a Sponsor"
        description="Partner with Nepalese Rhinos FC and support community football while growing your business. Explore our sponsorship opportunities."
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rhino-blue via-blue-700 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Partner With Us</h1>
            <p className="text-xl mb-8 opacity-90">
              Join the Nepalese Rhinos FC family and help us build a stronger football community 
              while growing your business reach and impact.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <span>Community Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-6 w-6" />
                <span>Brand Visibility</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6" />
                <span>Team Success</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-rhino-blue mb-4">Sponsorship Opportunities</h2>
              <p className="text-lg text-rhino-gray">Choose the partnership level that works best for your business</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {sponsorshipTiers.map((tier) => {
                const IconComponent = tier.icon;
                return (
                  <Card key={tier.tier} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className={`h-2 bg-gradient-to-r ${tier.color}`}></div>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-rhino-blue">{tier.tier} Partner</CardTitle>
                      <div className="text-3xl font-bold text-rhino-red">{tier.price}</div>
                      <p className="text-sm text-rhino-gray">per season</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-rhino-gray">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full mt-6 bg-rhino-blue hover:bg-blue-700"
                        onClick={() => handleInputChange('tier', tier.tier)}
                      >
                        Choose {tier.tier}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-rhino-blue mb-4">Why Partner With Nepalese Rhinos FC?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-rhino-blue/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-rhino-blue" />
                </div>
                <h3 className="font-bold text-rhino-blue mb-2">Community Connection</h3>
                <p className="text-rhino-gray text-sm">Connect with the vibrant Nepalese community in Shepparton and beyond</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-rhino-red/10 rounded-full flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-rhino-red" />
                </div>
                <h3 className="font-bold text-rhino-blue mb-2">Team Success</h3>
                <p className="text-rhino-gray text-sm">Be part of our journey to excellence in local football leagues</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Building className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="font-bold text-rhino-blue mb-2">Brand Visibility</h3>
                <p className="text-rhino-gray text-sm">Increase your brand awareness through our growing fan base</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="font-bold text-rhino-blue mb-2">Social Impact</h3>
                <p className="text-rhino-gray text-sm">Support youth development and community sports programs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-rhino-blue text-center">
                  Get Started Today
                </CardTitle>
                <p className="text-rhino-gray text-center">
                  Fill out the form below and we'll be in touch to discuss partnership opportunities
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-rhino-blue mb-2">
                        Company Name *
                      </label>
                      <Input
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Your company name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-rhino-blue mb-2">
                        Contact Name *
                      </label>
                      <Input
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-rhino-blue mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-rhino-blue mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-rhino-blue mb-2">
                      Interested Sponsorship Tier *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {sponsorshipTiers.map((tier) => (
                        <Badge
                          key={tier.tier}
                          variant={formData.tier === tier.tier ? "default" : "outline"}
                          className={`cursor-pointer p-3 ${
                            formData.tier === tier.tier 
                              ? 'bg-rhino-blue text-white' 
                              : 'hover:bg-rhino-blue/10'
                          }`}
                          onClick={() => handleInputChange('tier', tier.tier)}
                        >
                          {tier.tier} - {tier.price}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-rhino-blue mb-2">
                      Message
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your company and partnership goals..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full bg-rhino-blue hover:bg-blue-700 text-white font-semibold py-3"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Partnership Inquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-rhino-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6">Have Questions?</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center gap-3">
                <Mail className="h-6 w-6" />
                <span>sponsors@nepaleserhinos.com</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Phone className="h-6 w-6" />
                <span>+61 XXX XXX XXX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default BecomeASponsor;
