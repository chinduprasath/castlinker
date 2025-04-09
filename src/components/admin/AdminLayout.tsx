
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
  Menu,
  X,
  MessagesSquare
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();

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

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-background'} text-foreground`}>
      <div className="flex h-screen overflow-hidden">
        {/* Admin Sidebar */}
        <div 
          className={`${
            collapsed ? "w-16" : "w-60"
          } ${theme === 'light' ? 'bg-white shadow-md' : 'bg-card'} h-full ${theme === 'light' ? 'border-gray-200' : 'border-gold/10'} border-r transition-all duration-300 ease-in-out fixed left-0 top-0 z-50`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`flex items-center justify-between p-4 ${theme === 'light' ? 'border-gray-200' : 'border-gold/10'} border-b`}>
              <div className="flex items-center">
                {!collapsed && (
                  <span className="text-xl font-bold gold-gradient-text mr-2">CastLinker</span>
                )}
                <Shield className={`h-6 w-6 text-gold ${collapsed ? 'mx-auto' : ''}`} />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className={`${theme === 'light' ? 'text-gray-500 hover:text-gray-800' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {collapsed ? <Menu /> : <X />}
              </Button>
            </div>

            {/* Admin Info */}
            <div className={`p-4 ${theme === 'light' ? 'border-gray-200' : 'border-gold/10'} border-b ${collapsed ? "items-center" : ""}`}>
              <div className="flex items-center">
                <Avatar className={`h-10 w-10 ${theme === 'light' ? 'border-gray-300' : 'border-gold/30'} border-2`}>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className={`${theme === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-gold/20 text-gold'}`}>
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-800' : ''}`}>{user.name}</p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-muted-foreground'}`}>Admin</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-2">
              <nav className="px-2 space-y-1">
                {adminNavItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className={`w-full justify-start ${
                      collapsed ? "px-2" : "px-3"
                    } ${
                      theme === 'light' 
                        ? 'hover:bg-amber-50 hover:text-amber-600' 
                        : 'hover:bg-gold/10 hover:text-gold'
                    } mb-1`}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className={`h-5 w-5 ${!collapsed ? "mr-3" : ""}`} />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                ))}
              </nav>
            </ScrollArea>

            {/* Footer */}
            <div className={`p-4 ${theme === 'light' ? 'border-gray-200' : 'border-gold/10'} border-t`}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  theme === 'light' 
                    ? 'hover:bg-red-50 hover:text-red-500' 
                    : 'hover:bg-red-500/10 hover:text-red-500'
                }`}
                onClick={handleLogout}
              >
                <LogOut className={`h-5 w-5 ${!collapsed ? "mr-3" : ""}`} />
                {!collapsed && <span>Sign Out</span>}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${
            collapsed ? "ml-16" : "ml-60"
          }`}
        >
          <div className="p-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
