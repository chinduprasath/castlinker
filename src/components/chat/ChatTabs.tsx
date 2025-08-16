import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ChatTabsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  children: React.ReactNode;
}

export default function ChatTabs({ searchQuery, onSearchChange, children }: ChatTabsProps) {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="all" className="h-full mt-2">
            {children}
          </TabsContent>
          <TabsContent value="chats" className="h-full mt-2">
            {children}
          </TabsContent>
          <TabsContent value="groups" className="h-full mt-2">
            <div className="p-4 text-center text-muted-foreground">
              <p>No group chats yet</p>
              <p className="text-sm mt-1">Group chat feature coming soon!</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}