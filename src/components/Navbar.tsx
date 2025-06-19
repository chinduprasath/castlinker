
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, Film, Book, Users, Shield, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cinematic/80 backdrop-blur-md border-b border-gold/10">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 z-20">
          <span className="text-xl sm:text-2xl font-bold gold-gradient-text">CastLinker</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">About</Link>
          <Link to="/features" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">Features</Link>
          <Link to="/pricing" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">Pricing</Link>
          <Link to="/talent-directory" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">
            Talent Directory
          </Link>
          <Link to="/industry-hub" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">
            Industry Hub
          </Link>
          <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="border-gold/30 hover:border-gold text-foreground">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              User Dashboard
            </Button>
          </Link>
          <Link to="/admin/dashboard">
            <Button size="sm" className="bg-gold hover:bg-gold-dark text-cinematic">
              <Shield className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-foreground z-20 p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-10 bg-cinematic pt-16 animate-fade-in overflow-y-auto">
          <div className="container mx-auto px-4 py-4 h-full flex flex-col">
            <nav className="flex flex-col gap-4 flex-grow">
              <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2" onClick={() => setIsOpen(false)}>About</Link>
              <Link to="/features" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2" onClick={() => setIsOpen(false)}>Features</Link>
              <Link to="/pricing" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2" onClick={() => setIsOpen(false)}>Pricing</Link>
              <Link 
                to="/talent-directory" 
                className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Users className="h-4 w-4" />
                Talent Directory
              </Link>
              <Link 
                to="/industry-hub" 
                className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Book className="h-4 w-4" />
                Industry Hub
              </Link>
              <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2" onClick={() => setIsOpen(false)}>Contact</Link>
              
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gold/10 mt-auto">
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-gold/30 hover:border-gold text-foreground">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    User Dashboard
                  </Button>
                </Link>
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gold hover:bg-gold-dark text-cinematic">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
