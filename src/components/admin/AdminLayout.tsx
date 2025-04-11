
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
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

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  if (!user || !user.email.includes("admin")) {
    return <AccessDenied />;
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-amber-50/20' : 'bg-background'} text-foreground`}>
      <AdminHeader toggleSidebar={toggleSidebar} />
      <AdminSidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      <div className="flex h-screen pt-16">
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            collapsed ? "ml-16" : "ml-60"
          } pt-4 px-4 w-full`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
