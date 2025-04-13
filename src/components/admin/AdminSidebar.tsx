
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
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AdminSidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar = ({ collapsed, toggleSidebar }: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();

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
    <aside
      className={`
        ${collapsed ? "w-[70px]" : "w-[250px]"}
        fixed top-0 left-0
        h-screen
        z-40
        transition-all duration-300 ease-in-out
        border-r border-gold/15
        bg-gradient-to-b from-background to-background/90
        backdrop-blur-lg shadow-xl
        rounded-r-2xl
      `}
    >
      <div className="flex flex-col h-full pt-16"> {/* pt-16 to push content below navbar */}
        
        {/* Top section */}
        <div className="px-4 flex items-center justify-between pb-4">
          <div className="flex items-center">
            <Shield className={`h-6 w-6 text-gold`} />
            {!collapsed && (
              <span className="ml-2 font-semibold text-lg">Admin</span>
            )}
          </div>
          {!isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className="text-gold hover:bg-gold/10 hover:text-white border-gold/30 rounded-xl shadow-sm"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-1">
            {adminNavItems.map((item) => (
              collapsed ? (
                <TooltipProvider key={item.label} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full h-10 px-2 justify-center rounded-lg hover:bg-gold/10 hover:text-gold text-muted-foreground"
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className={theme === 'light' ? 'bg-white border-gray-200 text-gray-800' : ''}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start px-4 hover:bg-gold/10 hover:text-gold text-muted-foreground rounded-lg h-10"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="truncate">{item.label}</span>
                </Button>
              )
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom section */}
        <div className="p-4 border-t border-dashed border-gold/10">
          <div className={`flex ${collapsed ? "justify-center" : "justify-between items-center"}`}>
            {!collapsed && (
              <span className="text-xs text-muted-foreground">
                Theme
              </span>
            )}
            <ThemeToggle showTooltip={collapsed} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
