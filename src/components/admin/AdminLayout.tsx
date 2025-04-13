
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AccessDenied from "./AccessDenied";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Auto collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  if (!user || !user.email.includes("admin")) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AdminHeader toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden pt-16"> {/* Added pt-16 to account for fixed header height */}
        <AdminSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out p-4 md:p-6 ${
            collapsed ? "ml-[70px]" : "ml-[250px]"
          }`}
        >
          <div className="max-w-[2000px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
