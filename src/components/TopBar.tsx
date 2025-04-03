import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Search, Bell, Film, Shield } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { accountMenuItems } from '@/components/sidebar/menuItems';

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('')
    : '?';
    
  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-20 flex items-center justify-between px-6 bg-gradient-to-r from-background to-background/90 backdrop-blur-lg border-b border-gold/10">
      {/* Company Name */}
      <div className="flex items-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-gold" />
          <span className="text-xl font-bold gold-gradient-text">CastLinker</span>
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for jobs, talent, or content..." 
            className="pl-10 bg-background/50 border-gold/20 focus:border-gold hover:border-gold/40 transition-colors" 
          />
        </div>
      </div>
      
      {/* User Profile & Dropdown */}
      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="border-gold/20 hover:border-gold/40 hover:bg-gold/5"
          onClick={() => navigate('/notifications')}
        >
          <Bell className="h-4 w-4 mr-2" />
          <span className="text-sm">Notifications</span>
        </Button>
        
        {/* Browse Jobs Button */}
        <Button 
          size="sm" 
          className="bg-gold hover:bg-gold/80 text-background"
          onClick={() => navigate('/jobs')}
        >
          <Film className="h-4 w-4 mr-2" />
          <span className="text-sm">Browse Jobs</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer outline-none">
            <div className="flex items-center gap-2 rounded-full p-1 hover:bg-gold/5 transition-colors">
              <Avatar className="h-8 w-8 border border-gold/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gold/10 text-gold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="hidden md:block text-right">
                <h3 className="text-sm font-medium leading-none">{user.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
              </div>
              
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 bg-card border border-gold/10">
            <DropdownMenuLabel className="text-gold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gold/10" />
            
            {accountMenuItems.map((item) => (
              <DropdownMenuItem 
                key={item.path}
                className="cursor-pointer flex items-center gap-2 hover:bg-gold/5"
                onClick={() => handleMenuItemClick(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.text}</span>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator className="bg-gold/10" />
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2 text-red-500 hover:bg-red-500/5"
              onClick={handleLogout}
            >
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBar; 