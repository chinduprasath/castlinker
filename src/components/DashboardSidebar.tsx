<<<<<<< HEAD

import { useLocation } from 'react-router-dom';
import { Sidebar } from "@/components/ui/sidebar";
import SidebarHeader from '@/components/sidebar/SidebarHeader';
import SidebarProfile from '@/components/sidebar/SidebarProfile';
import SidebarMenuItem from '@/components/sidebar/SidebarMenuItem';
import SidebarMenuGroup from '@/components/sidebar/SidebarMenuGroup';
import SidebarFooter from '@/components/sidebar/SidebarFooter';
import { mainMenuItems, pageMenuItems, accountMenuItems } from '@/components/sidebar/menuItems';
=======
import { useLocation } from 'react-router-dom';
import { Sidebar } from "@/components/ui/sidebar";
import SidebarHeader from '@/components/sidebar/SidebarHeader';
import SidebarMenuItem from '@/components/sidebar/SidebarMenuItem';
import SidebarMenuGroup from '@/components/sidebar/SidebarMenuGroup';
import SidebarFooter from '@/components/sidebar/SidebarFooter';
import SidebarCollapseButton from '@/components/sidebar/SidebarCollapseButton';
import { mainMenuItems, pageMenuItems } from '@/components/sidebar/menuItems';
>>>>>>> 4ee9c98 (modified files)

interface DashboardSidebarProps {
  onToggle?: () => void;
  isCollapsed?: boolean;
}

const DashboardSidebar = ({ onToggle, isCollapsed = false }: DashboardSidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
<<<<<<< HEAD
    <Sidebar 
      className={`
        fixed top-0 left-0 h-full z-10
        border-r border-gold/15
        transition-all duration-300 ease-in-out
        bg-gradient-to-b from-background to-background/90
        backdrop-blur-lg shadow-xl
        ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}
      `}
    >
      <div className="flex flex-col h-full">
        <SidebarHeader isCollapsed={isCollapsed} onToggle={onToggle || (() => {})} />

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
=======
    <>
      <Sidebar 
        className={`
          fixed top-0 left-0 h-full z-20
          border-r border-gold/15
          transition-all duration-300 ease-in-out
          bg-gradient-to-b from-background to-background/90
          backdrop-blur-lg shadow-xl
          ${isCollapsed ? 'w-[70px]' : 'w-[250px]'}
        `}
      >
        <div className="flex flex-col h-full relative">
          <SidebarHeader isCollapsed={isCollapsed} onToggle={onToggle || (() => {})} />

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gold/10 scrollbar-track-transparent px-2 mt-4">
            <SidebarMenuGroup label="MAIN" isCollapsed={isCollapsed}>
              {mainMenuItems.map((item) => (
>>>>>>> 4ee9c98 (modified files)
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
<<<<<<< HEAD
          )}
          
          <SidebarMenuGroup label="ACCOUNT" isCollapsed={isCollapsed}>
            {accountMenuItems.map((item) => (
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
        </div>

        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </Sidebar>
=======

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
      </Sidebar>
      
      {/* Collapse/Expand Button */}
      <SidebarCollapseButton isCollapsed={isCollapsed} onToggle={onToggle || (() => {})} />
    </>
>>>>>>> 4ee9c98 (modified files)
  );
};

export default DashboardSidebar;
