
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Filter, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatSidebarProps {
  chats: Array<{
    id: string;
    name: string;
    lastMessage: string;
    lastMessageTime: string;
    unread: number;
    avatar: string;
    role?: string;
    online?: boolean;
  }>;
  activeChat: {
    id: string;
    name: string;
  } | null;
  onChatSelect: (chat: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ChatSidebar = ({
  chats,
  activeChat,
  onChatSelect,
  searchQuery,
  onSearchChange,
}: ChatSidebarProps) => {
  return (
    <div className="w-96 border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gold">Messages</h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gold hover:bg-gold/10 rounded-full"
          >
            <Plus size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gold hover:bg-gold/10 rounded-full"
          >
            <Filter size={20} />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10 bg-[#222222] border-0 text-white placeholder:text-gray-400 focus-visible:ring-gold/30"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer
                ${activeChat?.id === chat.id ? 'bg-gold/20 border-l-2 border-gold' : 'hover:bg-[#222222]'}
              `}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback className={`
                    ${activeChat?.id === chat.id ? 'bg-gold/20 text-gold' : 'bg-[#333333] text-gray-300'}
                  `}>
                    {chat.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#121212] rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className={`font-medium truncate ${activeChat?.id === chat.id ? 'text-gold' : 'text-white'}`}>
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-400">{chat.lastMessageTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-400 truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-gold text-black rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
                {chat.role && (
                  <span className="text-xs text-gray-500">{chat.role}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
