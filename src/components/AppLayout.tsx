
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import TopBar from '@/components/TopBar';
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from '@/contexts/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  // Public pages (don't show sidebar)
  const publicPages = ['/', '/login', '/signup', '/about', '/features', '/pricing', '/contact', '/privacy', '/help'];
  
  // Check if current path is an admin path
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // If we're on an admin route, just return the children without any AppLayout wrapping
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  const isPublicPage = publicPages.includes(location.pathname);
  // Show the navbar on public pages
  const showNavbar = isPublicPage;
  // Show sidebar when not on a public page
  const showSidebar = !isPublicPage;
  // Show topbar when not on public pages
  const showTopBar = !isPublicPage;
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

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-background'} text-foreground transition-colors duration-300`}>
      {/* Show Navbar on public pages */}
      {(showNavbar || isLandingPage) && <Navbar />}
      
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
