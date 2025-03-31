import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarHeader as BaseSidebarHeader } from "@/components/ui/sidebar";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarHeader = ({ isCollapsed, onToggle }: SidebarHeaderProps) => {
  return (
    <BaseSidebarHeader className="relative pb-4 border-b border-gold/10">
      <div className={`flex items-center justify-between px-4 py-4`}>
        <Link to="/dashboard" className="flex items-center">
          {!isCollapsed && (
            <span className="text-2xl font-bold gold-gradient-text">CastLinker</span>
          )}
          {isCollapsed && (
            <span className="text-2xl font-bold gold-gradient-text">CL</span>
          )}
        </Link>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="text-gold hover:bg-gold/10 hover:text-white border-gold/30 z-10"
          onClick={onToggle}
        >
          {isCollapsed ? 
            <ChevronRight className="h-5 w-5" /> : 
            <ChevronLeft className="h-5 w-5" />
          }
        </Button>
      </div>
    </BaseSidebarHeader>
  );
};

export default SidebarHeader;
