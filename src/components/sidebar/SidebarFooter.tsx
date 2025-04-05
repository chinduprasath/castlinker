
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ThemeToggle from '@/components/ThemeToggle';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  return (
    <div className="mt-auto px-4 py-3 border-t border-gold/10">
      <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between items-center'}`}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-muted-foreground hover:text-gold hover:bg-gold/10">
                <Link to="/help">
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Help</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Help</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {!isCollapsed && (
          <span className="text-xs text-muted-foreground">Theme</span>
        )}
        
        <ThemeToggle showTooltip={isCollapsed} />
      </div>
    </div>
  );
};

export default SidebarFooter;
