
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatContainer } from './ChatContainer';
import ChatSidebar from './ChatSidebar';

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;  // Changed from optional to required
  unread: number;           // Changed from optional to required
  avatar: string;           // Changed from optional to required
  role?: string;            // Kept as optional
  online?: boolean;         // Kept as optional
}

export const ChatPage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([
    { 
      id: '1', 
      name: 'Sarah Johnson', 
      lastMessage: 'Hello!',
      lastMessageTime: '10:30 AM',
      unread: 2,
      avatar: '/placeholder.svg',
      role: 'Casting Director',
      online: true
    },
    { 
      id: '2', 
      name: 'Michael Rodriguez', 
      lastMessage: 'How are you?',
      lastMessageTime: 'Yesterday',
      unread: 0,  // Adding a default value of 0 since unread is now required
      avatar: '/placeholder.svg',
      role: 'Director', 
      online: false
    },
  ]);
  const { user } = useAuth();

  // Find the active chat based on selectedRoom ID
  const activeChat = rooms.find(room => room.id === selectedRoom) || null;

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        chats={rooms}
        activeChat={activeChat}
        onChatSelect={(chat) => setSelectedRoom(chat.id)}
        searchQuery=""
        onSearchChange={() => {}}
      />
      <div className="flex-1">
        {selectedRoom ? (
          <ChatContainer roomId={selectedRoom} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
