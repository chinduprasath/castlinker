
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  BarChart, 
  Bell, 
  Settings, 
  Shield, 
  LogOut,
  Search,
  ChevronDown,
  User,
  HelpCircle,
  X,
  MessagesSquare
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from "@/components/ThemeToggle";
import DashboardSidebar from "@/components/DashboardSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  const adminNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: FileText, label: "Content Moderation", path: "/admin/content" },
    { icon: MessagesSquare, label: "Job Management", path: "/admin/jobs" },
    { icon: Calendar, label: "Event Management", path: "/admin/events" },
    { icon: BarChart, label: "Analytics", path: "/admin/analytics" },
    { icon: Bell, label: "Notifications", path: "/admin/notifications" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel",
    });
    navigate("/");
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Verify if the user is an admin - in a real application, this would be a proper role check
  // For this demo, we'll consider emails containing "admin" as admin accounts
  if (!user || !user.email.includes("admin")) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'light' ? 'bg-gray-50' : 'bg-background'}`}>
        <Shield className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className={`${theme === 'light' ? 'text-gray-600' : 'text-muted-foreground'} mb-4`}>You don't have permission to access the admin panel.</p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
    : '?';

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-amber-50/20' : 'bg-background'} text-foreground`}>
      {/* Top Bar */}
      <div className={`w-full border-b ${theme === 'light' ? 'border-gray-200 bg-white' : 'border-gold/10 bg-background/90'} backdrop-blur-sm fixed top-0 z-50 shadow-sm`}>
        <div className="flex h-16 items-center justify-between px-4">
          {isSearchOpen ? (
            <div className={`absolute left-0 top-0 w-full z-20 p-3 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-background border-gold/10'} border-b`}>
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className={`w-full ${theme === 'light' ? 'bg-white/60 border-gray-200' : 'bg-background/60'} pl-9 focus-visible:ring-amber-300/30 rounded-xl`}
                  autoFocus
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1" 
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Left side - Title or breadcrumb could go here */}
              <div className="md:hidden">
                {/* Mobile placeholder */}
              </div>
              
              {/* Search section - Desktop */}
              <div className="hidden md:block w-64">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className={`w-full ${theme === 'light' ? 'bg-white/60 border-gray-200' : 'bg-background/60'} pl-9 focus-visible:ring-amber-300/30 rounded-xl`}
                  />
                </div>
              </div>
              
              {/* Mobile search button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </>
          )}
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className={`relative ${theme === 'light' ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-100' : 'text-muted-foreground hover:text-foreground hover:bg-gold/5'} rounded-xl`}
              onClick={() => navigate('/admin/notifications')}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] rounded-full"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`h-9 gap-1 sm:gap-2 px-1 sm:px-2 rounded-xl ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gold/5'}`}>
                  <Avatar className={`h-7 w-7 sm:h-8 sm:w-8 ${theme === 'light' ? 'border border-amber-200' : 'border border-gold/20'}`}>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className={`${theme === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-gold/10 text-gold'} text-xs sm:text-sm`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start text-left">
                    <span className={`text-sm font-medium leading-none ${theme === 'light' ? 'text-gray-900' : 'text-foreground'}`}>{user.name}</span>
                    <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-muted-foreground'}`}>Admin</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 ${theme === 'light' ? 'text-gray-500' : 'text-muted-foreground'} hidden sm:block`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`w-56 rounded-xl ${theme === 'light' ? 'border-gray-200 bg-white' : ''}`} align="end">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator className={theme === 'light' ? 'bg-gray-200' : ''} />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/admin/profile')} className={`rounded-lg ${theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-gold/5'}`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/settings')} className={`rounded-lg ${theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-gold/5'}`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator className={theme === 'light' ? 'bg-gray-200' : ''} />
                <DropdownMenuItem onClick={() => navigate('/help')} className={`rounded-lg ${theme === 'light' ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-gold/5'}`}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator className={theme === 'light' ? 'bg-gray-200' : ''} />
                <DropdownMenuItem onClick={handleLogout} className={`text-red-500 focus:text-red-500 rounded-lg ${theme === 'light' ? 'hover:bg-red-50' : 'hover:bg-red-900/10'}`}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex h-screen overflow-hidden pt-16">
        {/* Use the shared DashboardSidebar component */}
        <DashboardSidebar 
          isCollapsed={collapsed} 
          onToggle={toggleSidebar} 
          adminItems={adminNavItems}
          showAdminItems={true}
        />

        {/* Main Content */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
            collapsed ? "ml-[70px]" : "ml-[250px]"
          } pt-4 px-4`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

// Add missing import
import { useTheme } from "@/contexts/ThemeContext";

export default AdminLayout;
