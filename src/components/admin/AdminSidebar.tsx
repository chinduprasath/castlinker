
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  BarChart, 
  Bell, 
  Settings, 
  Shield,
  MessagesSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminSidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar = ({ collapsed, toggleSidebar }: AdminSidebarProps) => {
  const navigate = useNavigate();
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

  return (
    <div 
      className={`${
        collapsed ? "w-16" : "w-60"
      } ${theme === 'light' ? 'bg-white shadow-md' : 'bg-card'} h-full ${theme === 'light' ? 'border-gray-200' : 'border-gold/10'} border-r transition-all duration-300 ease-in-out fixed left-0 top-16 z-40 rounded-r-2xl`}
    >
      <div className="flex flex-col h-full">
        <div className={`p-4 ${theme === 'light' ? 'border-gray-200' : 'border-gold/10'} border-b flex items-center justify-between`}>
          <div className="flex items-center">
            <Shield className={`h-6 w-6 ${theme === 'light' ? 'text-amber-600' : 'text-gold'}`} />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className={`flex-shrink-0 ${
              theme === 'light' 
                ? 'border-amber-200 text-amber-600 hover:bg-amber-50' 
                : 'hover:bg-gold/10 text-gold border-gold/30'
            }`}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>
        
        <ScrollArea className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            {adminNavItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start ${
                  collapsed ? "px-2" : "px-3"
                } ${
                  theme === 'light' 
                    ? 'hover:bg-amber-50 hover:text-amber-600 text-gray-700' 
                    : 'hover:bg-gold/10 hover:text-gold'
                } mb-1 rounded-xl`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={`h-5 w-5 ${!collapsed ? "mr-3" : ""}`} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            ))}
          </nav>
        </ScrollArea>

        <div className={`p-4 ${theme === 'light' ? 'border-gray-200' : 'border-gold/10'} border-t`}>
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-between items-center'}`}>
            {!collapsed && (
              <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-muted-foreground'}`}>Theme</span>
            )}
            
            <ThemeToggle showTooltip={collapsed} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
