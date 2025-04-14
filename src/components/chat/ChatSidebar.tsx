
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ChatRoom } from '@/types/supabase';

interface ChatSidebarProps {
  rooms: ChatRoom[];
  selectedRoom: string | null;
  loading: boolean;
  onSelectRoom: (roomId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  rooms,
  selectedRoom,
  loading,
  onSelectRoom
}) => {
  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-medium text-lg">Messages</h2>
        <Button variant="ghost" size="icon">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        ) : rooms.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No conversations yet.
          </div>
        ) : (
          rooms.map(room => (
            <div
              key={room.id}
              className={`p-3 cursor-pointer hover:bg-accent/50 border-b border-border flex items-start gap-3 ${
                selectedRoom === room.id ? 'bg-accent' : ''
              }`}
              onClick={() => onSelectRoom(room.id)}
            >
              <Avatar className="h-10 w-10">
                {room.users && room.users[0] ? (
                  <AvatarImage 
                    src={room.users[0].avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${room.users[0].id}`} 
                  />
                ) : null}
                <AvatarFallback>
                  {room.name ? room.name.charAt(0).toUpperCase() : 'C'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{room.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(room.last_message_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {room.metadata?.last_message || "Start a conversation"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
