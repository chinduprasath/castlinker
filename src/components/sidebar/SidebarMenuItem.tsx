
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import {
  SidebarMenuItem as BaseSidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      {isCollapsed ? (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton 
                asChild 
                isActive={isActive}
                className={`
                  transition-all duration-200 ease-in-out
                  mx-1 my-1.5 rounded-xl
                  ${isActive 
                    ? 'bg-gold/20 text-gold font-medium shadow-sm shadow-gold/10' 
                    : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
                  }
                `}
              >
                <Link to={path} className="flex items-center w-full justify-center px-2 py-2.5">
                  <div className={`
                    ${isActive
                      ? 'bg-gold/25 text-gold'
                      : 'text-foreground/60 group-hover:text-gold group-hover:bg-gold/10'}
                    p-1.5 rounded-lg transition-colors duration-200
                  `}>
                    <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-gold' : ''}`} />
                  </div>
                </Link>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {text}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <SidebarMenuButton 
          asChild 
          isActive={isActive}
          className={`
            transition-all duration-200 ease-in-out
            mx-2 my-1 rounded-xl text-lg
            ${isActive 
              ? 'bg-gold/20 text-gold font-medium shadow-sm shadow-gold/10' 
              : 'text-foreground/70 hover:text-gold hover:bg-gold/10'
            }
          `}
        >
          <Link to={path} className="flex items-center w-full py-2.5 px-3">
            <div className={`
              ${isActive
                ? 'bg-gold/25 text-gold'
                : 'text-foreground/60 group-hover:text-gold group-hover:bg-gold/10'}
              p-1.5 rounded-lg transition-colors duration-200
            `}>
              <Icon className={`h-[18px] w-[18px] ${isActive ? 'text-gold' : ''}`} />
            </div>
            <span className={`
              ml-3 font-medium text-base truncate
              ${isActive ? 'text-gold' : 'text-foreground/80'}
            `}>
              {text}
            </span>
          </Link>
        </SidebarMenuButton>
      )}
    </BaseSidebarMenuItem>
  );
};

export default SidebarMenuItem;
