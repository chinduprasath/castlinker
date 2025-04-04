
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video, Info, Search, Clock, Plus, Filter, Star, MailPlus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Chat = () => {
  const {
    chats,
    activeChat,
    messages,
    isLoading,
    userTyping,
    searchQuery,
    showUnreadOnly,
    sortBy,
    setActiveChat,
    sendMessage,
    markChatAsRead,
    indicateTyping,
    setSearchQuery,
    setShowUnreadOnly,
    setSortBy,
    editMessage,
    deleteMessage,
    addReaction,
    createGroupChat,
    uploadAttachment
  } = useChat();
  
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupParticipants, setGroupParticipants] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create a new group chat
  const handleCreateGroupChat = async () => {
    if (groupName.trim() && groupParticipants.length > 0) {
      await createGroupChat(groupName.trim(), groupParticipants);
      setShowNewChatDialog(false);
      setGroupName("");
      setGroupParticipants([]);
    }
  };

  // Process messages to group them by sender for avatar display
  const processedMessages = messages.map((message, index) => {
    const isFirstInGroup = index === 0 || messages[index - 1].senderId !== message.senderId;
    const isLastInGroup = index === messages.length - 1 || messages[index + 1].senderId !== message.senderId;
    
    return {
      ...message,
      showAvatar: isFirstInGroup,
      isLastInGroup
    };
  });

  return (
    <Card className="h-[calc(100vh-120px)] border-none rounded-xl overflow-hidden shadow-2xl bg-card/95">
      <div className="flex h-full">
        {/* Chat List Sidebar */}
        <div className="w-1/3 md:w-1/4 border-r border-gold/10 flex flex-col">
          <CardHeader className="px-4 py-3 border-b border-gold/10 bg-card/90 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold gold-gradient-text">Messages</h2>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-gold/5"
                        onClick={() => setShowNewChatDialog(true)}
                      >
                        <Plus className="h-5 w-5 text-gold/70" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>New conversation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-gold/5">
                      <Filter className="h-5 w-5 text-gold/70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className={showUnreadOnly ? "bg-gold/10" : ""}
                      onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    >
                      Show unread only
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={sortBy === 'newest' ? "bg-gold/10" : ""}
                      onClick={() => setSortBy('newest')}
                    >
                      Sort by newest
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={sortBy === 'oldest' ? "bg-gold/10" : ""}
                      onClick={() => setSortBy('oldest')}
                    >
                      Sort by oldest
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={sortBy === 'active' ? "bg-gold/10" : ""}
                      onClick={() => setSortBy('active')}
                    >
                      Sort by most active
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-10 bg-background/50 border-gold/10 focus-visible:ring-gold/30 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1">
            {chats.length === 0 ? (
              <div className="p-4 text-center text-foreground/60">
                <p>No conversations found</p>
                <Button 
                  className="mt-2 bg-gold hover:bg-gold/90 text-black"
                  onClick={() => setShowNewChatDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start new chat
                </Button>
              </div>
            ) : (
              chats.map((chat) => (
                <div 
                  key={chat.id}
                  className={`p-3 cursor-pointer transition-all ${
                    activeChat?.id === chat.id 
                      ? 'bg-gold/5 hover:bg-gold/10 border-l-2 border-gold' 
                      : 'hover:bg-card/90 border-l-2 border-transparent'
                  }`}
                  onClick={() => setActiveChat(chat)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border border-gold/10">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback className="bg-gold/10 text-gold">{chat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`font-medium truncate ${activeChat?.id === chat.id ? 'text-gold' : ''}`}>{chat.name}</h3>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-foreground/60" />
                          <span className="text-xs text-foreground/60 whitespace-nowrap">{chat.lastMessageTime}</span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground/70 truncate">{chat.lastMessage}</p>
                      {chat.role && <p className="text-xs text-foreground/60 mt-1">{chat.role}</p>}
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-gold text-black text-xs rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center ml-1">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
        
        {/* Chat Area */}
        <div className="w-2/3 md:w-3/4 flex flex-col bg-gradient-to-br from-background/70 to-background/90">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <CardHeader className="px-6 py-3 border-b border-gold/10 bg-card/40 backdrop-blur-sm flex-row items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-gold/10">
                    <AvatarImage src={activeChat.avatar} />
                    <AvatarFallback className="bg-gold/10 text-gold">{activeChat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg gold-gradient-text">{activeChat.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      {activeChat.online !== undefined && (
                        <>
                          <span className={`h-2 w-2 rounded-full ${activeChat.online ? 'bg-green-500' : 'bg-foreground/30'}`}></span>
                          <span>{activeChat.online ? 'Online' : 'Offline'}</span>
                          <span>•</span>
                        </>
                      )}
                      {activeChat.isGroup ? (
                        <span>{activeChat.participants.length} members</span>
                      ) : (
                        <span>{activeChat.role || 'Contact'}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-gold/5 border-gold/20 hover:bg-gold/10 hover:border-gold/30">
                    <Phone className="h-4 w-4 text-gold" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-gold/5 border-gold/20 hover:bg-gold/10 hover:border-gold/30">
                    <Video className="h-4 w-4 text-gold" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-gold/5 border-gold/20 hover:bg-gold/10 hover:border-gold/30">
                    <Info className="h-4 w-4 text-gold" />
                  </Button>
                </div>
              </CardHeader>
              
              {/* Messages Area */}
              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-4 min-h-[calc(100%-80px)]">
                  {processedMessages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      showAvatar={message.showAvatar}
                      isLastInGroup={message.isLastInGroup}
                      onEdit={editMessage}
                      onDelete={deleteMessage}
                      onReact={addReaction}
                    />
                  ))}
                  
                  {/* Typing indicator */}
                  {userTyping && userTyping.chatId === activeChat.id && (
                    <div className="flex justify-start">
                      <div className="flex flex-row gap-2 max-w-[75%]">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={activeChat.avatar} />
                          <AvatarFallback className="bg-gold/10 text-gold">{activeChat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="py-2.5 px-3.5 rounded-2xl bg-card/80 border border-gold/5 rounded-bl-none shadow-sm mt-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <CardFooter className="p-4 border-t border-gold/10 bg-card/40 backdrop-blur-sm mt-auto">
                <ChatInput
                  onSendMessage={sendMessage}
                  onTyping={() => indicateTyping(activeChat.id)}
                />
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MailPlus className="h-16 w-16 text-gold/40 mb-4" />
              <h2 className="text-2xl font-bold mb-2">No conversation selected</h2>
              <p className="text-foreground/60 mb-6 max-w-md">
                Select an existing conversation or start a new chat to begin messaging
              </p>
              <Button 
                className="bg-gold hover:bg-gold/90 text-black"
                onClick={() => setShowNewChatDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Start new conversation
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* New Chat Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent className="sm:max-w-[500px] bg-cinematic-dark border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="h-5 w-5 text-gold" />
              Create New Conversation
            </DialogTitle>
            <DialogDescription>
              Start a new individual or group conversation with other users.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Conversation Name</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Film Project Team"
                className="bg-background/50 border-gold/10 focus-visible:ring-gold/30"
              />
              <p className="text-xs text-foreground/60">
                Enter a name for your conversation or group chat
              </p>
            </div>
            
            {/* In a real app, this would be a user search/select component */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Participants</label>
              <div className="p-4 border border-dashed border-gold/20 rounded-lg text-center">
                <p className="text-foreground/60">
                  This would be a user selection component in a real application
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-gold/20"
                  onClick={() => setGroupParticipants(['user123', 'user456', 'user789'])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Select Users
                </Button>
                
                {groupParticipants.length > 0 && (
                  <p className="mt-2 text-sm text-foreground/80">
                    {groupParticipants.length} participants selected
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowNewChatDialog(false)}
              className="border-gold/20"
            >
              Cancel
            </Button>
            <Button 
              className="bg-gold hover:bg-gold/90 text-black"
              onClick={handleCreateGroupChat}
              disabled={!groupName.trim() || groupParticipants.length === 0}
            >
              Create Conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Chat;
