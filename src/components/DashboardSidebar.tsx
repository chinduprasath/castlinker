
import { useLocation } from 'react-router-dom';
import { Sidebar } from "@/components/ui/sidebar";
import SidebarHeader from '@/components/sidebar/SidebarHeader';
import SidebarProfile from '@/components/sidebar/SidebarProfile';
import SidebarMenuItem from '@/components/sidebar/SidebarMenuItem';
import SidebarMenuGroup from '@/components/sidebar/SidebarMenuGroup';
import SidebarFooter from '@/components/sidebar/SidebarFooter';
import { mainMenuItems, pageMenuItems } from '@/components/sidebar/menuItems';
import { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardSidebarProps {
  onToggle?: () => void;
  isCollapsed?: boolean;
  adminItems?: Array<{
    icon: LucideIcon; 
    label: string;
    path: string;
  }>;
  showAdminItems?: boolean;
}

const DashboardSidebar = ({ 
  onToggle, 
  isCollapsed: propIsCollapsed,
  adminItems,
  showAdminItems = false
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
    <div className={`
      fixed top-0 left-0 h-full z-30
      border-r border-gold/15
      transition-all duration-300 ease-in-out
      bg-gradient-to-b from-background to-background/90
      backdrop-blur-lg shadow-xl
      rounded-r-2xl
      ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}
    `}>
      <div className="flex flex-col h-full">
        <SidebarHeader isCollapsed={isCollapsed} onToggle={handleToggle} />

        <SidebarProfile isCollapsed={isCollapsed} />

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/10 scrollbar-track-transparent px-2">
          {showAdminItems && adminItems ? (
            <SidebarMenuGroup label="ADMIN" isCollapsed={isCollapsed}>
              {adminItems.map((item) => (
                <SidebarMenuItem 
                  key={item.path}
                  icon={item.icon}
                  text={item.label}
                  path={item.path}
                  isActive={isActive(item.path)}
                  isCollapsed={isCollapsed}
                />
              ))}
            </SidebarMenuGroup>
          ) : (
            <>
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
            </>
          )}
        </div>

        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default DashboardSidebar;
