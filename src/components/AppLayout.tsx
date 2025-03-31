
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Public pages (don't need authentication and don't show sidebar)
  const publicPages = ['/', '/login', '/signup', '/about', '/features', '/pricing', '/contact', '/privacy', '/help'];
  
  // Check if current path is an admin path
  const isAdminPage = location.pathname.startsWith('/admin');
  
  const isPublicPage = publicPages.includes(location.pathname);
  // Only show the navbar on the landing page and true public pages when not logged in
  const showNavbar = (location.pathname === '/' || isPublicPage) && !user;
  // Show sidebar when logged in and not on a public page and not on admin pages
  const showSidebar = user && !isPublicPage && !isAdminPage;

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 text-foreground">
      {showNavbar && <Navbar />}
      
      {showSidebar ? (
        <SidebarProvider defaultOpen={!sidebarCollapsed}>
          <div className="flex min-h-screen w-full">
            <DashboardSidebar onToggle={toggleSidebar} isCollapsed={sidebarCollapsed} />
            <main 
              className={`
                flex-1 transition-all duration-300 ease-in-out pt-6 pb-8
                ${sidebarCollapsed ? 'ml-[-50px]' : 'ml-[80px]'} pr-[50px]
              `}
            >
              <div className="w-full px-1">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      ) : (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default AppLayout;
