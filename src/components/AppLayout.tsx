
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
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
  const publicPages = ['/', '/login', '/signup', '/about', '/features', '/pricing', '/contact', '/privacy', '/help', '/admin/login'];
  
  // Check if current path is an admin path
  const isAdminPage = location.pathname.startsWith('/admin');
  
  const isPublicPage = publicPages.includes(location.pathname);
  // Only show the navbar on true public pages when not logged in
  const showNavbar = isPublicPage && !user && location.pathname !== '/';
  // Show sidebar when logged in and not on a public page and not on admin pages
  const showSidebar = user && !isPublicPage && !isAdminPage;
  // Show topbar when user is logged in and not on admin pages
  const showTopBar = user && !isAdminPage;
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
  if (isAdminPage && location.pathname !== '/admin/login') {
    return children;
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-background'} text-foreground transition-colors duration-300`}>
      {/* Show Navbar on landing page or public pages without user logged in */}
      {(showNavbar || isLandingPage && !user) && <Navbar />}
      
      {showSidebar ? (
        <SidebarProvider defaultOpen={!sidebarCollapsed}>
          <div className="flex min-h-screen w-full">
            <DashboardSidebar onToggle={toggleSidebar} isCollapsed={sidebarCollapsed} />
            <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'ml-[15px]' : 'ml-[10px]'} w-[calc(100%-${sidebarCollapsed ? '70px' : '250px'})]`}>
              {showTopBar && <TopBar />}
              <main className="p-2 sm:p-4 overflow-x-hidden">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      ) : (
        <div>
          {showTopBar && <TopBar />}
          <div className={showNavbar ? "pt-16" : ""}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
