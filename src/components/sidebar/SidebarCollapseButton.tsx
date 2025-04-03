import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarCollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarCollapseButton = ({ isCollapsed, onToggle }: SidebarCollapseButtonProps) => {
  return (
    <div 
      className={`
        fixed z-50
        ${isCollapsed ? 'left-[66px]' : 'left-[246px]'}
        top-[80px]
      `}
    >
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7 rounded-full border border-gold bg-background shadow-md hover:bg-gold/10"
        onClick={onToggle}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5 text-gold" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 text-gold" />
        )}
      </Button>
    </div>
  );
};

export default SidebarCollapseButton; 