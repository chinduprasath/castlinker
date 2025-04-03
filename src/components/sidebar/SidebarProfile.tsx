<<<<<<< HEAD
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
=======
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Bell, Film, ArrowRight } from 'lucide-react';
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
>>>>>>> 4ee9c98 (modified files)

interface SidebarProfileProps {
  isCollapsed: boolean;
}

const SidebarProfile = ({ isCollapsed }: SidebarProfileProps) => {
<<<<<<< HEAD
  const { user } = useAuth();
=======
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
>>>>>>> 4ee9c98 (modified files)
  
  if (!user) return null;
  
  const initials = user.name
<<<<<<< HEAD
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
    : '?';
  
  return (
    <div className={`py-4 px-4 border-b border-gold/10`}>
      <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-3'}`}>
        <Avatar className="h-10 w-10 border border-gold/20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-gold/10 text-gold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {!isCollapsed && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">{user.name}</h3>
            <p className="text-xs text-muted-foreground">{user.role}</p>
=======
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
    <div className={`py-4 px-4 border-b border-gold/10 ${isCollapsed ? 'items-center' : ''}`}>
      {!isCollapsed && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-10 bg-background/50 border-gold/20 focus:border-gold hover:border-gold/40 transition-colors" 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      )}
      
      <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between items-center'}`}>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center cursor-pointer outline-none">
            <div className={`flex items-center gap-2 rounded-full p-1 hover:bg-gold/5 transition-colors ${isCollapsed ? 'flex-col' : ''}`}>
              <Avatar className="h-10 w-10 border border-gold/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gold/10 text-gold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              {!isCollapsed && (
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium leading-none mr-1">{user.name}</h3>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              )}
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
        
        {!isCollapsed && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 border-gold/20 hover:border-gold/40 hover:bg-gold/5"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-4 w-4 text-gold" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 border-gold/20 hover:border-gold/40 hover:bg-gold/5" 
              onClick={() => navigate('/jobs')}
            >
              <Film className="h-4 w-4 text-gold" />
            </Button>
>>>>>>> 4ee9c98 (modified files)
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfile;
