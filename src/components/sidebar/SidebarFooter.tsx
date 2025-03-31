
import { Link } from 'react-router-dom';
import { Shield, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="mt-auto px-4 py-4 border-t border-gold/10">
      <div className={`flex ${isCollapsed ? 'flex-col' : 'items-center'} justify-between gap-2`}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground hover:text-gold">
                <Link to="/help">
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Help</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Help</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-muted-foreground hover:text-gold">
                <Link to="/privacy">
                  <Shield className="h-5 w-5" />
                  <span className="sr-only">Privacy</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Privacy</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                size="icon" 
                className="rounded-full h-8 w-8 text-muted-foreground hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Sign out</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SidebarFooter;
