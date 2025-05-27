
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting contact form:', formData);
      
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (error) {
        console.error('Error submitting contact form:', error);
        throw error;
      }

      console.log('Contact form submitted successfully');
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Contact Us</h2>
            <p className="text-rhino-gray text-lg">Get in touch with Nepalese Rhinos FC</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-rhino-blue">
                  <Send size={24} />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="mt-1"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-rhino-red hover:bg-red-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-rhino-blue">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-rhino-red mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-rhino-blue mb-1">Address</h4>
                      <p className="text-rhino-gray">
                        McEwen Reserve<br />
                        Shepparton, Victoria<br />
                        Australia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="text-rhino-red mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-rhino-blue mb-1">Phone</h4>
                      <p className="text-rhino-gray">+61 XXX XXX XXX</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="text-rhino-red mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-rhino-blue mb-1">Email</h4>
                      <p className="text-rhino-gray">info@nepaleserhinos.com.au</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="text-rhino-red mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-rhino-blue mb-1">Training Times</h4>
                      <p className="text-rhino-gray">
                        Tuesdays & Thursdays: 6:30 PM - 8:00 PM<br />
                        Saturdays: 2:00 PM - 4:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-rhino-blue">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <a href="/join-us" className="block text-rhino-red hover:text-red-700 font-medium">
                      → Join Our Team
                    </a>
                    <a href="/fixtures" className="block text-rhino-red hover:text-red-700 font-medium">
                      → View Fixtures
                    </a>
                    <a href="/gallery" className="block text-rhino-red hover:text-red-700 font-medium">
                      → Photo Gallery
                    </a>
                    <a href="/about" className="block text-rhino-red hover:text-red-700 font-medium">
                      → About Us
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
