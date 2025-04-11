
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import TopBar from '@/components/TopBar';
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from '@/contexts/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  // Public pages (don't need authentication and don't show sidebar)
  const publicPages = ['/', '/login', '/signup', '/about', '/features', '/pricing', '/contact', '/privacy', '/help'];
  
  // Check if current path is an admin path
  const isAdminPage = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
  const isAdminLoginPage = location.pathname === '/admin/login';
  
  const isPublicPage = publicPages.includes(location.pathname);
  // Only show the navbar on true public pages when not logged in
  const showNavbar = isPublicPage && !user && location.pathname !== '/';
  // Show sidebar when logged in and not on a public page and not on admin pages
  const showSidebar = user && !isPublicPage && !isAdminPage && !isAdminLoginPage;
  // Show topbar when user is logged in and not on admin pages
  const showTopBar = user && !isAdminPage && !isAdminLoginPage;
  // Special case for landing page - show navbar but with different styling
  const isLandingPage = location.pathname === '/';

  // Auto collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Don't render anything for admin pages as they have their own layout
  if (isAdminPage) {
    return children;
  }

  if (isAdminLoginPage) {
    return children;
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-background'} text-foreground transition-colors duration-300`}>
      {/* Show Navbar on landing page or public pages without user logged in */}
      {(showNavbar || isLandingPage && !user) && <Navbar />}
      
      {showSidebar ? (
        <div className="flex min-h-screen w-full">
          <DashboardSidebar onToggle={toggleSidebar} isCollapsed={sidebarCollapsed} />
          <div className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarCollapsed 
              ? 'ml-[70px]' 
              : 'ml-[250px]'
          }`}>
            {showTopBar && <TopBar />}
            <main className="p-2 sm:p-4 md:p-6 max-w-[2000px] mx-auto overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <div className="max-w-[2000px] mx-auto">
          {showTopBar && <TopBar />}
          <div className={`${showNavbar ? "pt-16" : ""}`}>
            <main className="p-2 sm:p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
