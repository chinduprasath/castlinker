import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface ResponsiveHeaderProps {
  onToggleSidebar?: () => void;
  showMenuButton?: boolean;
}

const ResponsiveHeader = ({ onToggleSidebar, showMenuButton = true }: ResponsiveHeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(3);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  if (!user) return null;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
    : '?';
  
  return (
    <header className="w-full border-b border-gold/10 bg-background/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4">
        {/* Left - Menu Button & App Name */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-gold/10 rounded-xl"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          {/* App Name - Centered on Mobile */}
          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2">
            <Link to="/dashboard">
              <h1 className="text-lg font-bold gold-gradient-text">CastLinker</h1>
            </Link>
          </div>
          
          {/* Desktop App Name */}
          <div className="hidden md:block">
            <Link to="/dashboard">
              <h1 className="text-xl font-bold gold-gradient-text">CastLinker</h1>
            </Link>
          </div>
        </div>

        {/* Center - Search (Desktop Only) */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background/60 pl-9 pr-4 h-10 focus-visible:ring-gold/30 rounded-xl border-gold/20"
            />
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden hover:bg-gold/10 rounded-xl"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-gold/10 rounded-xl"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] rounded-full min-w-[16px]"
              >
                {notifications}
              </Badge>
            )}
          </Button>
          
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-9 gap-2 px-2 rounded-xl hover:bg-gold/5 focus:ring-2 focus:ring-gold/20"
              >
                <Avatar className="h-7 w-7 border border-gold/20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gold/10 text-gold text-xs font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start text-left">
                  <span className="text-sm font-medium leading-none truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {user.role || 'User'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 rounded-xl bg-background/95 backdrop-blur-sm border-gold/20" 
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="text-sm font-medium">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')} 
                  className="rounded-lg cursor-pointer focus:bg-gold/10"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')} 
                  className="rounded-lg cursor-pointer focus:bg-gold/10"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20 rounded-lg cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="absolute left-0 top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-gold/10 md:hidden animate-in slide-in-from-top duration-200">
          <div className="p-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-background/60 pl-9 pr-12 h-10 focus-visible:ring-gold/30 rounded-xl border-gold/20"
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8" 
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ResponsiveHeader;