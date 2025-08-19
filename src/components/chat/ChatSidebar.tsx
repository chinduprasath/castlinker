import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Filter, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  connectedUsers: Array<{
    id: string;
    name: string;
    avatar: string;
    online?: boolean;
    role?: string;
  }>;
  groups: Array<{
    id: string;
    name: string;
    lastMessage: string;
    lastMessageTime: string;
    unread: number;
    avatar: string;
    memberCount: number;
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
  connectedUsers,
  groups,
  activeChat,
  onChatSelect,
  searchQuery,
  onSearchChange,
}: ChatSidebarProps) => {
  const [activeTab, setActiveTab] = useState("all");

  // Filter function for search
  const filterItems = (items: any[], searchQuery: string) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredConnectedUsers = filterItems(connectedUsers, searchQuery);
  const filteredChats = filterItems(chats, searchQuery);
  const filteredGroups = filterItems(groups, searchQuery);

  const renderUserItem = (user: any, isChat = false) => (
    <div 
      key={user.id}
      onClick={() => onChatSelect(user)}
      className={`
        flex items-center gap-3 p-3 rounded-xl cursor-pointer border border-gray-100 dark:border-[#232323] mb-2 transition
        ${activeChat?.id === user.id ? 'bg-yellow-100 dark:bg-[#232323] border-l-4 border-yellow-400 dark:border-yellow-700' : 'hover:bg-gray-100 dark:hover:bg-[#232323]'}
      `}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className={`
            ${activeChat?.id === user.id ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-500'}
          `}>
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {user.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      <div className="flex-1 min-w-0 text-gray-900 dark:text-white">
        <div className="flex justify-between items-center">
          <h3 className={`font-medium truncate 
            ${activeChat?.id === user.id ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-900 dark:text-white'}`}
          >
            {user.name}
          </h3>
          {isChat && user.lastMessageTime && (
            <span className="text-xs text-gray-500">{user.lastMessageTime}</span>
          )}
        </div>
        {isChat && (
          <>
            <div className="flex items-center gap-1 mt-1">
              {user.unread > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-gold text-black rounded-full">
                  {user.unread}
                </span>
              )}
            </div>
            <div className="mt-2 text-xs truncate w-full text-gray-500 dark:text-gray-300">
              {user.lastMessage}
            </div>
          </>
        )}
        {user.role && (
          <span className="text-xs text-gray-500">{user.role}</span>
        )}
        {user.memberCount && (
          <span className="text-xs text-gray-500">{user.memberCount} members</span>
        )}
      </div>
    </div>
  );

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
      
      <div className="p-4 bg-white dark:bg-[#232323] border-b border-gray-200 dark:border-[#232323]">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="all" className="h-full mt-2">
            <ScrollArea className="h-full bg-white dark:bg-[#181818]">
              <div className="space-y-1 p-2">
                {filteredConnectedUsers.length > 0 ? (
                  filteredConnectedUsers.map((user) => renderUserItem(user, false))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    <p>No connected users found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="chats" className="h-full mt-2">
            <ScrollArea className="h-full bg-white dark:bg-[#181818]">
              <div className="space-y-1 p-2">
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat) => renderUserItem(chat, true))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    <p>No chats found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="groups" className="h-full mt-2">
            <ScrollArea className="h-full bg-white dark:bg-[#181818]">
              <div className="space-y-1 p-2">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => renderUserItem(group, true))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    <p>No group chats yet</p>
                    <p className="text-sm mt-1">Group chat feature coming soon!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ChatSidebar;
