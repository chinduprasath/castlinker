
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatContainer } from './ChatContainer';
import ChatSidebar from './ChatSidebar';
import ChatHeader from './ChatHeader';
import ChatMessageArea from './ChatMessageArea';
import ChatInputBar from './ChatInputBar';

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;  
  unread: number;           
  avatar: string;           
  role?: string;            
  online?: boolean;         
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
      unread: 0,  
      avatar: '/placeholder.svg',
      role: 'Director', 
      online: false
    },
  ]);
  const [messages, setMessages] = useState<Record<string, any[]>>({
    // Initially empty - we'll simulate no messages for new chats
  });
  const [chatRequestResponses, setChatRequestResponses] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  // Find the active chat based on selectedRoom ID
  const activeChat = rooms.find(room => room.id === selectedRoom) || null;

  const handleSendMessage = (message: string) => {
    if (!selectedRoom) return;
    
    // Add the message to the selected room
    setMessages(prev => ({
      ...prev,
      [selectedRoom]: [...(prev[selectedRoom] || []), {
        id: Date.now().toString(),
        content: message,
        isMe: true,
        timestamp: new Date().toLocaleTimeString(),
      }]
    }));
  };

  const handleAcceptChat = () => {
    if (!selectedRoom) return;
    
    console.log("Chat accepted:", selectedRoom);
    setChatRequestResponses(prev => ({
      ...prev,
      [selectedRoom]: true
    }));
  };

  const handleDeclineChat = () => {
    if (!selectedRoom) return;
    
    console.log("Chat declined:", selectedRoom);
    setChatRequestResponses(prev => ({
      ...prev,
      [selectedRoom]: false
    }));
  };

  // Check if this is the first time viewing this chat and no messages exist
  const showChatRequest = () => {
    return (
      selectedRoom && 
      (!messages[selectedRoom] || messages[selectedRoom].length === 0) && 
      chatRequestResponses[selectedRoom] === undefined
    );
  };

  const isChatDeclined = selectedRoom ? chatRequestResponses[selectedRoom] === false : false;
  const shouldDisableInput = showChatRequest() || isChatDeclined;

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar
        chats={rooms}
        activeChat={activeChat}
        onChatSelect={(chat) => setSelectedRoom(chat.id)}
        searchQuery=""
        onSearchChange={() => {}}
      />
      <div className="flex-1 flex flex-col">
        {!selectedRoom ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Select a chat to start messaging
            </p>
          </div>
        ) : (
          <>
            <ChatHeader chat={activeChat} />
            
            <ChatMessageArea 
              messages={messages[selectedRoom] || []}
              isLoading={false}
              showChatRequest={showChatRequest()}
              chatRequestDeclined={isChatDeclined}
              senderName={activeChat?.name || ''}
              onAcceptChat={handleAcceptChat}
              onDeclineChat={handleDeclineChat}
            />
            
            {chatRequestResponses[selectedRoom] !== false && (
              <ChatInputBar 
                onSendMessage={handleSendMessage}
                disabled={shouldDisableInput}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
