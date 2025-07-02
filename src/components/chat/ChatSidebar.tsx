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
    <div className="w-96 border-r border-gray-200 dark:border-[#232323] bg-white dark:bg-[#232323] flex flex-col rounded-xl border border-gray-100 dark:border-[#232323]">
      <div className="p-4 border-b border-gray-200 dark:border-[#232323] bg-white dark:bg-[#232323] flex justify-between items-center">
        <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">Messages</h2>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gold dark:text-yellow-400 hover:bg-gold/10 dark:hover:bg-yellow-900 rounded-full"
          >
            <Plus size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gold dark:text-yellow-400 hover:bg-gold/10 dark:hover:bg-yellow-900 rounded-full"
          >
            <Filter size={20} />
          </Button>
        </div>
      </div>
      
      <div className="p-4 bg-white dark:bg-[#232323]">
        <div className="relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
          />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10 bg-gray-100 dark:bg-[#181818] border border-gray-200 dark:border-[#232323] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-yellow-200 dark:focus-visible:ring-yellow-700"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 bg-white dark:bg-[#181818]">
        <div className="space-y-1 p-2">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`
                flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-gray-100 dark:border-[#232323] mb-2 transition
                ${activeChat?.id === chat.id ? 'bg-yellow-100 dark:bg-[#232323] border-l-4 border-yellow-400 dark:border-yellow-700' : 'hover:bg-gray-100 dark:hover:bg-[#232323]'}
              `}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback className={`
                    ${activeChat?.id === chat.id ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-500'}
                  `}>
                    {chat.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-gray-900 dark:text-white">
                <div className="flex justify-between items-center">
                  <h3 className={`font-medium truncate 
                    ${activeChat?.id === chat.id ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}
                  >
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {chat.unread > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-gold text-black rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs truncate w-full text-gray-500 dark:text-gray-300">
                  {chat.lastMessage}
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
