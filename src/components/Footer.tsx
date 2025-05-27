
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-rhino-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Club Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/lovable-uploads/6c39d309-610c-4c6d-8c26-4de7cddfd60a.png" 
                  alt="Nepalese Rhinos FC" 
                  className="h-10 w-10"
                />
                <div>
                  <h3 className="font-bold">Nepalese Rhinos FC</h3>
                  <p className="text-sm opacity-75">Est. 2023</p>
                </div>
              </div>
              <p className="text-sm opacity-75">
                A proud community football club bringing together Nepalese heritage and Australian spirit in Shepparton.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="opacity-75 hover:opacity-100 transition-opacity">About Us</a></li>
                <li><a href="#teams" className="opacity-75 hover:opacity-100 transition-opacity">Our Team</a></li>
                <li><a href="#fixtures" className="opacity-75 hover:opacity-100 transition-opacity">Fixtures</a></li>
                <li><a href="#join" className="opacity-75 hover:opacity-100 transition-opacity">Join Us</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>McEwen Reserve</li>
                <li>Shepparton, VIC 3630</li>
                <li>0412 345 678</li>
                <li>info@nepaleserhinosfc.com.au</li>
              </ul>
            </div>

            {/* Social Media & Affiliations */}
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex gap-3 mb-6">
                <a href="#" className="text-white hover:text-rhino-red transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-white hover:text-rhino-red transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-white hover:text-rhino-red transition-colors">
                  <Youtube size={24} />
                </a>
              </div>
              <div className="text-sm">
                <p className="opacity-75 mb-1">Affiliated with:</p>
                <p className="opacity-75">Football Victoria</p>
                <p className="opacity-75">Goulburn North East FL</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-75">
              <p>&copy; 2024 Nepalese Rhinos FC. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
                <a href="#" className="hover:opacity-100 transition-opacity">Code of Conduct</a>
                <a href="#" className="hover:opacity-100 transition-opacity">Child Safety</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
