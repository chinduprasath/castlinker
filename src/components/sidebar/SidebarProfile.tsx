
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
    <div className={`py-4 px-4 border-b border-gold/10 flex ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
      <Avatar className="h-10 w-10 border border-gold/20">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-gold/10 text-gold">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default SidebarProfile;
