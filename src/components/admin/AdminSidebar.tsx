
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Settings,
  Menu,
  ChevronRight,
  ChevronLeft,
  Bell,
  BarChart2,
  FileText,
  Shield,
  FileTextIcon,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

interface AdminSidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const AdminSidebar = ({ collapsed, toggleSidebar }: AdminSidebarProps) => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      title: "User Management",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Team Management",
      icon: Shield,
      href: "/admin/team",
    },
    {
      title: "Job Management",
      icon: Briefcase,
      href: "/admin/jobs",
    },
    {
      title: "Post Management",
      icon: FileTextIcon,
      href: "/admin/posts",
    },
    {
      title: "Event Management",
      icon: Calendar,
      href: "/admin/events",
    },
    {
      title: "Analytics",
      icon: BarChart2,
      href: "/admin/analytics",
    },
    {
      title: "Ticket Management",
      icon: Ticket,
      href: "/admin/tickets",
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  if (!mounted) return null;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-border bg-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          {!collapsed && (
            <Link to="/admin/dashboard">
              <h1 className="text-xl font-bold gold-gradient-text">Admin Panel</h1>
            </Link>
          )}
          {collapsed && (
            <Link to="/admin/dashboard">
              <Shield className="h-6 w-6 text-gold" />
            </Link>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <Separator />

      <div className="flex-1 overflow-y-auto pt-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex h-10 items-center rounded-md text-muted-foreground hover:bg-muted",
                isActive(item.href) && "bg-gold/10 text-gold hover:bg-gold/20",
                collapsed ? "justify-center" : "px-4"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive(item.href) && "text-gold")} />
              {!collapsed && <span className="ml-2">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t p-2 flex justify-center items-center">
        <ThemeToggle showTooltip={true} className="w-full" />
      </div>
    </aside>
  );
};

export default AdminSidebar;
