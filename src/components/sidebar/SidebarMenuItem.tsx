import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import {
  SidebarMenuItem as BaseSidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  text: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarMenuItem = ({ icon: Icon, text, path, isActive, isCollapsed }: SidebarMenuItemProps) => {
  return (
    <BaseSidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive} 
        tooltip={isCollapsed ? text : undefined}
        className={`
          transition-all duration-200 ease-in-out
          ${isCollapsed ? 'mx-1' : 'mx-2'} 
          my-1 rounded-lg
          ${isActive 
            ? 'bg-gold/20 text-gold font-medium shadow-sm shadow-gold/10' 
            : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
          }
        `}
      >
        <Link to={path} className={`
          flex items-center w-full py-2.5 
          ${isCollapsed ? 'justify-center px-2' : 'px-3'}`
        }>
          <div className={`
            ${isActive
              ? 'bg-gold/25 text-gold'
              : 'text-foreground/60 group-hover:text-gold group-hover:bg-gold/10'}
            ${isCollapsed ? 'p-1.5' : 'p-1.5'}
            rounded-md transition-colors duration-200
          `}>
            <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-gold' : ''}`} />
          </div>
          {!isCollapsed && (
            <span className={`
              ml-3 font-medium text-sm truncate
              ${isActive ? 'text-gold' : 'text-foreground/80'}
            `}>
              {text}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
};

export default SidebarMenuItem;
