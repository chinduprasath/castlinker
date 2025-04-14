
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  type: string;
  is_deleted: boolean;
  is_edited: boolean;
  metadata: any;
  sender?: {
    full_name: string;
    avatar_url: string;
  };
}

interface ChatRoom {
  id: string;
  name: string;
  type: string;
  users?: any[];
}

interface ChatContainerProps {
  roomId: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ roomId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch room info and messages
  useEffect(() => {
    if (!user || !roomId) return;
    
    const fetchRoomInfo = async () => {
      try {
        // Get room details
        const { data: roomData, error: roomError } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('id', roomId)
          .single();
        
        if (roomError) throw roomError;
        
        // Get other room members
        const { data: membersData, error: membersError } = await supabase
          .from('chat_room_members')
          .select('user_id')
          .eq('room_id', roomId)
          .neq('user_id', user.id);
        
        if (membersError) throw membersError;
        
        const userIds = membersData?.map(m => m.user_id) || [];
        let users = [];
        
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('*')
            .in('id', userIds);
            
          users = profiles || [];
        }
        
        // For one-to-one chats, set the name to the other user's name
        let roomName = roomData.name;
        if (roomData.type === 'one_to_one' && users.length > 0) {
          roomName = users[0].full_name || "Chat";
        }
        
        setRoomInfo({
          ...roomData,
          name: roomName,
          users
        });
        
      } catch (error) {
        console.error('Error fetching room info:', error);
        toast({
          title: "Error",
          description: "Failed to load chat room information",
          variant: "destructive"
        });
      }
    };
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // Get messages for this room
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });
        
        if (messagesError) throw messagesError;
        
        // Get sender information for each message
        if (messagesData && messagesData.length > 0) {
          const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
          
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('id, full_name, avatar_url')
            .in('id', senderIds);
          
          const profileMap = (profiles || []).reduce((map, profile) => {
            map[profile.id] = profile;
            return map;
          }, {} as Record<string, any>);
          
          const messagesWithSenders = messagesData.map(message => ({
            ...message,
            sender: profileMap[message.sender_id]
          }));
          
          setMessages(messagesWithSenders);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomInfo();
    fetchMessages();
    
    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('messages_for_room')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, payload => {
        // Refetch all messages to ensure we have sender information
        fetchMessages();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [roomId, user]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim() || !roomId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          sender_id: user.id,
          content: newMessage.trim(),
          type: 'text'
        });
      
      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        {roomInfo && (
          <>
            <Avatar className="h-10 w-10">
              {roomInfo.users && roomInfo.users[0] ? (
                <AvatarImage src={roomInfo.users[0].avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${roomInfo.users[0].id}`} />
              ) : null}
              <AvatarFallback>
                {roomInfo.name ? roomInfo.name.charAt(0).toUpperCase() : 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{roomInfo.name}</h3>
              <p className="text-sm text-muted-foreground">
                {roomInfo.type === 'one_to_one' ? 'Direct Message' : 'Group'}
              </p>
            </div>
          </>
        )}
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id}
              className={`flex gap-2 ${message.sender_id === user?.id ? 'justify-end' : ''}`}
            >
              {message.sender_id !== user?.id && (
                <Avatar className="h-8 w-8">
                  {message.sender ? (
                    <AvatarImage src={message.sender.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender_id}`} />
                  ) : null}
                  <AvatarFallback>
                    {message.sender?.full_name.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] ${message.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-accent'} rounded-lg p-3`}>
                {message.type === 'system' ? (
                  <p className="italic text-sm text-muted">{message.content}</p>
                ) : (
                  <>
                    {message.sender_id !== user?.id && (
                      <p className="text-xs font-medium mb-1">{message.sender?.full_name || 'Unknown'}</p>
                    )}
                    <p className="break-words">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {format(new Date(message.created_at), 'h:mm a')}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
