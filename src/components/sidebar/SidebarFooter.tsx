<<<<<<< HEAD

import { Link } from 'react-router-dom';
import { Shield, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
=======
import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
>>>>>>> 4ee9c98 (modified files)

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
<<<<<<< HEAD
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

=======
  // Using local state for theme toggle until we fully integrate ThemeContext
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? 'light' : 'dark';
  });
  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Apply theme changes to the document
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className="mt-auto mb-4 px-4 pt-4 border-t border-gold/10">
      <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
        {!isCollapsed && <span className="text-xs text-muted-foreground">APPEARANCE</span>}
        
>>>>>>> 4ee9c98 (modified files)
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
<<<<<<< HEAD
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
=======
                variant="outline" 
                size="icon" 
                className="text-gold hover:bg-gold/10 hover:text-white border-gold/30 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? 'right' : 'top'}>
              {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            </TooltipContent>
>>>>>>> 4ee9c98 (modified files)
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SidebarFooter;
