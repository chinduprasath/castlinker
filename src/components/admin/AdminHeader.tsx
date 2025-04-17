
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState(3); // Mock notification count
  
  const handleLogout = () => {
    logout();
    navigate('/admin');
  };
  
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
    : '?';
  
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 bg-background/90 backdrop-blur-md z-10">
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-9 focus-visible:ring-gold/30"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => navigate('/admin/notifications')}
        >
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full"
            >
              {notifications}
            </Badge>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2" role="button" aria-label="Profile menu">
              <Avatar className="h-8 w-8 border border-gold/20">
                <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                <AvatarFallback className="bg-gold/10 text-gold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:inline-block">
                {user?.name}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
