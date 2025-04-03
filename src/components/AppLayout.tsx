<<<<<<< HEAD

=======
>>>>>>> 4ee9c98 (modified files)
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from '@/components/Navbar';
<<<<<<< HEAD
=======
import TopBar from '@/components/TopBar';
>>>>>>> 4ee9c98 (modified files)
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
<<<<<<< HEAD
  // Only show the navbar on the landing page and true public pages when not logged in
  const showNavbar = (location.pathname === '/' || isPublicPage) && !user;
  // Show sidebar when logged in and not on a public page and not on admin pages
  const showSidebar = user && !isPublicPage && !isAdminPage;
=======
  // Only show the navbar on true public pages when not logged in, but NOT on the landing page
  const showNavbar = isPublicPage && !user && location.pathname !== '/';
  // Show sidebar when logged in and not on a public page and not on admin pages
  const showSidebar = user && !isPublicPage && !isAdminPage;
  // Show TopBar when user is logged in and not on admin pages
  const showTopBar = user && !isAdminPage;
>>>>>>> 4ee9c98 (modified files)

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
<<<<<<< HEAD
            <main 
              className={`
                flex-1 transition-all duration-300 ease-in-out px-4 py-4
                ${sidebarCollapsed ? 'ml-[-90px]' : 'ml-[10px]'}
=======
            {showTopBar && <TopBar />}
            <main 
              className={`
                flex-1 transition-all duration-300 ease-in-out px-6 py-6
                ${sidebarCollapsed ? 'ml-[70px]' : 'ml-[250px]'}
                ${showTopBar ? 'mt-16' : ''}
>>>>>>> 4ee9c98 (modified files)
              `}
            >
              {children}
            </main>
          </div>
        </SidebarProvider>
      ) : (
<<<<<<< HEAD
        <div>
=======
        <div className="px-6 py-6">
>>>>>>> 4ee9c98 (modified files)
          {children}
        </div>
      )}
    </div>
  );
};

export default AppLayout;
