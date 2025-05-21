
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatContainer } from './ChatContainer';
import ChatSidebar from './ChatSidebar';

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
}

export const ChatPage: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([
    { id: '1', name: 'Sarah Johnson', lastMessage: 'Hello!' },
    { id: '2', name: 'Michael Rodriguez', lastMessage: 'How are you?' },
  ]);
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        rooms={rooms}
        selectedRoom={selectedRoom}
        onRoomSelect={setSelectedRoom}
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
