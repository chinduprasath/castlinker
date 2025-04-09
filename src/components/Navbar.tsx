import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, LogOut, Film, Book, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cinematic/80 backdrop-blur-md border-b border-gold/10">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
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
          {user ? (
            <div className="flex items-center gap-2 lg:gap-4">
              <Link to="/jobs">
                <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-gold">
                  <Film className="h-4 w-4 mr-2" />
                  Jobs
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-gold">
                  Messages
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full p-0 h-8 w-8">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-cinematic-dark border border-gold/10">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gold/10" />
                  <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-gold/30 hover:border-gold text-foreground">
                  <LogIn className="h-4 w-4 mr-2" />
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gold hover:bg-gold-dark text-cinematic">
                  <User className="h-4 w-4 mr-2" />
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-cinematic border-t border-gold/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-foreground/60">{user.role}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2 flex items-center gap-2">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link to="/jobs" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2 flex items-center gap-2">
                    <Film className="h-4 w-4" />
                    Jobs
                  </Link>
                  <Link to="/chat" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2">
                    Messages
                  </Link>
                </>
              ) : null}
              <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2">About</Link>
              <Link to="/features" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2">Features</Link>
              <Link to="/pricing" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2">Pricing</Link>
              <Link to="/talent-directory" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Talent Directory
              </Link>
              <Link to="/industry-hub" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2 flex items-center gap-2">
                <Book className="h-4 w-4" />
                Industry Hub
              </Link>
              <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors py-2">Contact</Link>
              
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gold/10">
                {user ? (
                  <Button variant="outline" className="w-full border-gold/30 hover:border-gold text-red-500" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outline" className="w-full border-gold/30 hover:border-gold text-foreground">
                        <LogIn className="h-4 w-4 mr-2" />
                        Log in
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full bg-gold hover:bg-gold-dark text-cinematic">
                        <User className="h-4 w-4 mr-2" />
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
