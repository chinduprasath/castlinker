
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatContainer } from './ChatContainer';
import { ChatSidebar } from './ChatSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ChatRoom } from '@/types/supabase';

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadChatRooms = async () => {
      setLoading(true);
      try {
        // Get chat rooms through RPC function
        const { data: roomsData, error: roomsError } = await supabase
          .rpc('get_user_chat_rooms');
        
        if (roomsError) throw roomsError;
        
        if (roomsData && roomsData.length > 0) {
          setRooms(roomsData);
          // If we have rooms and no selected room, select the first one
          if (!selectedRoom) {
            setSelectedRoom(roomsData[0].id);
          }
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error('Error loading chat rooms:', error);
        toast({
          title: "Error",
          description: "Failed to load chat rooms",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadChatRooms();

    // Subscribe to changes in chat rooms and messages
    const channel = supabase
      .channel('chat_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_rooms',
      }, () => {
        loadChatRooms();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_room_members',
        filter: `user_id=eq.${user.id}`
      }, () => {
        loadChatRooms();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, () => {
        loadChatRooms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast, selectedRoom]);

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        rooms={rooms}
        selectedRoom={selectedRoom}
        loading={loading}
        onSelectRoom={setSelectedRoom}
      />
      <div className="flex-1">
        {selectedRoom ? (
          <ChatContainer roomId={selectedRoom} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              {loading ? "Loading chats..." : rooms.length === 0 
                ? "No chats found. Connect with users to start messaging."
                : "Select a chat to start messaging"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
