
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  ChevronDown,
  User,
  Settings,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
    : '?';

  return (
    <div className="h-16 border-b border-gold/15 bg-background/95 backdrop-blur-sm sticky top-0 z-10 w-full px-4">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-4 w-[40%]">
          <div className={`relative w-full max-w-md transition-all duration-200 ${isSearchFocused ? 'w-full' : 'w-[90%]'}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 bg-muted/50 border-none h-9"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative rounded-full h-9 w-9 text-muted-foreground hover:text-gold"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 hover:bg-muted/60">
                <Avatar className="h-8 w-8 border border-gold/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gold/10 text-gold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.role}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background border border-gold/10">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gold/10" />
              
              <DropdownMenuItem className="cursor-pointer hover:bg-gold/10" onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-gold/10" onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-gold/10" onClick={() => navigate('/privacy')}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Privacy</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-gold/10" onClick={() => navigate('/billing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-gold/10" onClick={() => navigate('/help')}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gold/10" />
              
              <DropdownMenuItem className="cursor-pointer text-red-500 hover:bg-red-500/10" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
