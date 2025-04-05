
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeToggleProps {
  showTooltip?: boolean;
  className?: string;
}

const ThemeToggle = ({ showTooltip = true, className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const toggleButton = (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className={`rounded-xl border-gold/30 shadow-sm hover:bg-gold/10 ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-gold transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-gold transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );

  if (!showTooltip) {
    return toggleButton;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {toggleButton}
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
