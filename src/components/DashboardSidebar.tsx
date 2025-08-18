
import { useLocation } from 'react-router-dom';
import SidebarHeader from '@/components/sidebar/SidebarHeader';
import SidebarProfile from '@/components/sidebar/SidebarProfile';
import SidebarMenuItem from '@/components/sidebar/SidebarMenuItem';
import SidebarMenuGroup from '@/components/sidebar/SidebarMenuGroup';
import SidebarFooter from '@/components/sidebar/SidebarFooter';
import { mainMenuItems, pageMenuItems } from '@/components/sidebar/menuItems';
import { useState } from 'react';

interface DashboardSidebarProps {
  onToggle?: () => void;
  isCollapsed?: boolean;
  isOpen?: boolean;
  isMobile?: boolean;
}

const DashboardSidebar = ({ 
  onToggle, 
  isCollapsed: propIsCollapsed, 
  isOpen = true, 
  isMobile = false 
}: DashboardSidebarProps) => {
  const location = useLocation();
  const [localIsCollapsed, setLocalIsCollapsed] = useState(false);
  
  // Use either the prop value (if controlled from parent) or local state
  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : localIsCollapsed;
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setLocalIsCollapsed(!localIsCollapsed);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleToggle}
        />
      )}
      
      <div 
        className={`
          fixed top-0 left-0 h-full z-50
          border-r border-gold/15
          transition-all duration-300 ease-in-out
          bg-gradient-to-b from-background to-background/90
          backdrop-blur-lg shadow-xl
          ${isMobile ? 'rounded-r-2xl' : 'rounded-r-2xl'}
          ${isMobile 
            ? `${isOpen ? 'translate-x-0' : '-translate-x-full'} w-[280px]`
            : `${isCollapsed ? 'w-[70px]' : 'w-[250px]'}`
          }
        `}
      >
      <div className="flex flex-col h-full">
        <SidebarHeader isCollapsed={isCollapsed} onToggle={handleToggle} />

        <SidebarProfile isCollapsed={isCollapsed} />

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/10 scrollbar-track-transparent px-2">
          <SidebarMenuGroup label="MAIN" isCollapsed={isCollapsed}>
            {mainMenuItems.map((item) => (
              <SidebarMenuItem 
                key={item.path}
                icon={item.icon}
                text={item.text}
                path={item.path}
                isActive={isActive(item.path)}
                isCollapsed={isCollapsed}
              />
            ))}
          </SidebarMenuGroup>

          {pageMenuItems.length > 0 && (
            <SidebarMenuGroup label="PAGES" isCollapsed={isCollapsed}>
              {pageMenuItems.map((item) => (
                <SidebarMenuItem 
                  key={item.path}
                  icon={item.icon}
                  text={item.text}
                  path={item.path}
                  isActive={isActive(item.path)}
                  isCollapsed={isCollapsed}
                />
              ))}
            </SidebarMenuGroup>
          )}
        </div>

        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </div>
    </>
  );
};

export default DashboardSidebar;
