
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rhino-blue mb-4">Contact Us</h2>
            <p className="text-rhino-gray text-lg">Get in touch with Nepalese Rhinos FC</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-rhino-blue mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-rhino-red">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-rhino-blue">Home Ground</h4>
                    <p className="text-rhino-gray">McEwen Reserve<br />Shepparton, Victoria 3630</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-rhino-red">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-rhino-blue">Phone</h4>
                    <p className="text-rhino-gray">0412 345 678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-rhino-red">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-rhino-blue">Email</h4>
                    <p className="text-rhino-gray">info@nepaleserhinosfc.com.au</p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8">
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-rhino-gray">Interactive Map - McEwen Reserve, Shepparton</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-rhino-blue">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input placeholder="Email Address" type="email" />
                <Input placeholder="Phone Number" />
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option>General Inquiry</option>
                  <option>Player Registration</option>
                  <option>Sponsorship</option>
                  <option>Volunteer Opportunities</option>
                </select>
                <textarea 
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                ></textarea>
                <Button className="w-full bg-rhino-red hover:bg-red-700 text-white">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
