
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
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
    <div className="w-1/3 md:w-1/4 border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/70">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <Button size="sm" className="bg-gold text-black hover:bg-gold/90">
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search chats..." 
            className="pl-9 bg-background/70"
          />
        </div>
      </div>
      
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading chats...
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No conversations found
          </div>
        ) : (
          rooms.map((room) => {
            // Extract the other user's info for display in direct messages
            const otherUser = room.users && room.users.length > 0 ? room.users[0] : null;
            
            return (
              <div
                key={room.id}
                className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 ${
                  selectedRoom === room.id ? 'bg-accent/30' : ''
                }`}
                onClick={() => onSelectRoom(room.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {otherUser ? (
                      <AvatarImage src={otherUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.id}`} />
                    ) : null}
                    <AvatarFallback>
                      {room.name ? room.name.charAt(0).toUpperCase() : 'C'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{room.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {room.last_message_at ? new Date(room.last_message_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {room.metadata?.last_message || "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
