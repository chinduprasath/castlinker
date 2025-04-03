import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Bell, Settings, Shield } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';

const AdminTopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  if (!user) return null;
  
  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('')
    : 'A';
    
  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel",
    });
    navigate("/");
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-20 flex items-center justify-between px-6 bg-gradient-to-r from-background to-background/90 backdrop-blur-lg border-b border-gold/10 ml-60">
      {/* Admin Badge */}
      <div className="flex items-center">
        <div className="flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full">
          <Shield className="h-4 w-4 text-gold" />
          <span className="text-sm font-medium text-gold">Admin Panel</span>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users, content, or settings..." 
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
          onClick={() => navigate('/admin/notifications')}
        >
          <Bell className="h-4 w-4 mr-2" />
          <span className="text-sm">Alerts</span>
        </Button>
        
        {/* Settings Button */}
        <Button 
          variant="outline"
          size="sm" 
          className="border-gold/20 hover:border-gold/40 hover:bg-gold/5"
          onClick={() => navigate('/admin/settings')}
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="text-sm">Settings</span>
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
                <p className="text-xs text-muted-foreground mt-1">Administrator</p>
              </div>
              
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 bg-card border border-gold/10">
            <DropdownMenuLabel className="text-gold">Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gold/10" />
            
            <DropdownMenuItem 
              className="cursor-pointer flex items-center gap-2 hover:bg-gold/5"
              onClick={() => navigate('/admin/profile')}
            >
              <Shield className="h-4 w-4" />
              <span>Admin Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="cursor-pointer flex items-center gap-2 hover:bg-gold/5"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="h-4 w-4" />
              <span>System Settings</span>
            </DropdownMenuItem>
            
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

export default AdminTopBar; 