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
        ${collapsed ? "w-16" : "w-60"}
        ${theme === "light" ? "bg-white shadow-md" : "bg-card"}
        fixed top-0 left-0
        h-screen
        z-40
        transition-all duration-300 ease-in-out
        border-r
        ${theme === "light" ? "border-gray-200" : "border-gold/10"}
      `}
    >
      <div className="flex flex-col h-full pt-16"> {/* pt-16 to push content below navbar */}
        
        {/* Top section */}
        <div className="px-4 flex items-center justify-between pb-4">
          <div className="flex items-center">
            <Shield className={`h-6 w-6 ${theme === "light" ? "text-amber-600" : "text-gold"}`} />
            {!collapsed && (
              <span className="ml-2 font-semibold text-lg">Admin</span>
            )}
          </div>
          {!isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className={`ml-2 ${
                theme === "light"
                  ? "border-amber-200 text-amber-600 hover:bg-amber-50"
                  : "hover:bg-gold/10 text-gold border-gold/30"
              }`}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2">
          <nav className="space-y-1">
            {adminNavItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`
                  w-full justify-start
                  ${collapsed ? "px-2" : "px-4"}
                  ${theme === "light"
                    ? "hover:bg-amber-50 hover:text-amber-600 text-gray-700"
                    : "hover:bg-gold/10 hover:text-gold text-muted-foreground"}
                  rounded-lg h-10
                `}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={`h-5 w-5 ${!collapsed ? "mr-3" : ""}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Button>
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom section */}
        <div className="p-4 border-t border-dashed">
          <div className={`flex ${collapsed ? "justify-center" : "justify-between items-center"}`}>
            {!collapsed && (
              <span className={`text-xs ${theme === "light" ? "text-gray-500" : "text-muted-foreground"}`}>
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
