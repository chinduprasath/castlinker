
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatContainer } from './ChatContainer';
import { ChatSidebar } from './ChatSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ChatRoom {
  id: string;
  name: string;
  type: 'one_to_one' | 'group';
  last_message_at: string;
  metadata: any;
  users?: any[];
}

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
        // Get all rooms where the current user is a member
        const { data: memberData, error: memberError } = await supabase
          .from('chat_room_members')
          .select('room_id')
          .eq('user_id', user.id);

        if (memberError) throw memberError;
        
        if (!memberData || memberData.length === 0) {
          setRooms([]);
          setLoading(false);
          return;
        }

        const roomIds = memberData.map(item => item.room_id);

        // Get details of those rooms
        const { data: roomsData, error: roomsError } = await supabase
          .from('chat_rooms')
          .select('*')
          .in('id', roomIds)
          .order('last_message_at', { ascending: false });

        if (roomsError) throw roomsError;

        // For each room, get the other members
        const roomsWithUsers = await Promise.all(
          (roomsData || []).map(async (room) => {
            const { data: membersData } = await supabase
              .from('chat_room_members')
              .select('user_id')
              .eq('room_id', room.id)
              .neq('user_id', user.id);

            const userIds = membersData?.map(m => m.user_id) || [];
            
            // Get profile data for these users
            let users = [];
            if (userIds.length > 0) {
              const { data: profiles } = await supabase
                .from('user_profiles')
                .select('*')
                .in('id', userIds);
                
              users = profiles || [];
            }
            
            // For one-to-one chats, set the name to the other user's name
            let roomName = room.name;
            if (room.type === 'one_to_one' && users.length > 0) {
              roomName = users[0].full_name || "Chat";
            }
            
            return {
              ...room,
              name: roomName,
              users: users
            };
          })
        );

        setRooms(roomsWithUsers);
        
        // If we have rooms and no selected room, select the first one
        if (roomsWithUsers.length > 0 && !selectedRoom) {
          setSelectedRoom(roomsWithUsers[0].id);
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
    const roomSubscription = supabase
      .channel('chat_room_changes')
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
      supabase.removeChannel(roomSubscription);
    };
  }, [user]);

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
