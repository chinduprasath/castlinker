
import { useState, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useDebounce } from "@/hooks/useDebounce";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessageArea from "@/components/chat/ChatMessageArea";
import ChatInputBar from "@/components/chat/ChatInputBar";

const Chat = () => {
  // Mock user data
  const user = { id: "mock-user", name: "Mock User" };
  
  const { 
    messages,
    sendMessage,
    isLoading
  } = useChat(''); 
  
  const [mockChats, setMockChats] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      lastMessage: "When can you send the audition tape?",
      lastMessageTime: "10:30 AM",
      unread: 2,
      avatar: "/placeholder.svg",
      role: "Casting Director",
      online: true
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      lastMessage: "I loved your performance in that short film!",
      lastMessageTime: "Yesterday",
      unread: 0,
      avatar: "/placeholder.svg",
      role: "Director",
      online: false
    },
    {
      id: "3",
      name: "Emma Thompson",
      lastMessage: "Let's discuss the contract details",
      lastMessageTime: "Monday",
      unread: 0,
      avatar: "/placeholder.svg",
      role: "Producer",
      online: true
    },
    {
      id: "4",
      name: "Film Project Team",
      lastMessage: "Hey team, I've uploaded the latest schedule",
      lastMessageTime: "08/10/2023",
      unread: 3,
      avatar: "/placeholder.svg"
    }
  ]);
  
  const [activeChat, setActiveChat] = useState(mockChats[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 300);
  const [chatRequestResponses, setChatRequestResponses] = useState<Record<string, boolean>>({
    // Pre-accept chat 1 to show messages immediately
    "1": true
  });
  
  const handleSendMessage = (inputMessage: string) => {
    sendMessage(inputMessage);
  };

  const handleAcceptChat = () => {
    console.log("Chat accepted:", activeChat.id);
    setChatRequestResponses(prev => ({
      ...prev,
      [activeChat.id]: true
    }));
  };

  const handleDeclineChat = () => {
    console.log("Chat declined:", activeChat.id);
    setChatRequestResponses(prev => ({
      ...prev,
      [activeChat.id]: false
    }));
  };

  // Check if this is the first time viewing this chat and no messages exist
  const showChatRequest = () => {
    return (
      activeChat && 
      messages.length === 0 && 
      chatRequestResponses[activeChat.id] === undefined
    );
  };

  const isChatDeclined = activeChat?.id ? chatRequestResponses[activeChat.id] === false : false;
  const shouldDisableInput = showChatRequest() || isChatDeclined;

  return (
    <div className="flex h-[calc(100vh-120px)] bg-[#121212] text-white">
      <ChatSidebar 
        chats={mockChats}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 flex flex-col">
        {!activeChat ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a conversation to start messaging
          </div>
        ) : (
          <>
            <ChatHeader chat={activeChat} />
            
            <ChatMessageArea 
              messages={messages}
              isLoading={false} // Set to false by default to prevent showing loading message
              showChatRequest={showChatRequest()}
              chatRequestDeclined={isChatDeclined}
              senderName={activeChat.name}
              onAcceptChat={handleAcceptChat}
              onDeclineChat={handleDeclineChat}
            />
            
            {chatRequestResponses[activeChat?.id] !== false && (
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

export default Chat;
