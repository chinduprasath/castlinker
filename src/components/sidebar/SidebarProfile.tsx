import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProfileProps {
  isCollapsed: boolean;
}

const SidebarProfile = ({ isCollapsed }: SidebarProfileProps) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
    : '?';
  
  return (
    <div className={`py-4 px-4 border-b border-gold/10`}>
      <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-3'}`}>
        <Avatar className="h-10 w-10 border border-gold/20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-gold/10 text-gold">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        {!isCollapsed && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium leading-none">{user.name}</h3>
            <p className="text-xs text-muted-foreground">{user.role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfile;
