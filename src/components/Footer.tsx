
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cinematic-dark py-12 px-4 border-t border-gold/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold gold-gradient-text">CastLinker</span>
            </Link>
            <p className="text-foreground/70 mb-6">
              Connecting talent with opportunity in the film industry.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/70 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-gold transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-foreground/70 hover:text-gold transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-foreground/70 hover:text-gold transition-colors">Pricing</Link></li>
              <li><Link to="/testimonials" className="text-foreground/70 hover:text-gold transition-colors">Testimonials</Link></li>
              <li><Link to="/faq" className="text-foreground/70 hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-foreground/70 hover:text-gold transition-colors">Blog</Link></li>
              <li><Link to="/guides" className="text-foreground/70 hover:text-gold transition-colors">Industry Guides</Link></li>
              <li><Link to="/events" className="text-foreground/70 hover:text-gold transition-colors">Events</Link></li>
              <li><Link to="/webinars" className="text-foreground/70 hover:text-gold transition-colors">Webinars</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-foreground/70 hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-foreground/70 hover:text-gold transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-foreground/70 hover:text-gold transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-foreground/70 hover:text-gold transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gold/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CastLinker. All rights reserved.
          </p>
          <div className="flex items-center">
            <a href="mailto:info@castlinker.com" className="text-foreground/60 hover:text-gold transition-colors flex items-center">
              <Mail size={16} className="mr-2" />
              <span className="text-sm">info@castlinker.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
