
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video, Info, Search, PaperclipIcon, MoreVertical, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

// Dummy data for chat messages
const dummyChats = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Casting Director",
    avatar: "/placeholder.svg",
    lastMessage: "When can you send the audition tape?",
    time: "10:30 AM",
    unread: 2,
    online: true
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    role: "Director",
    avatar: "/placeholder.svg",
    lastMessage: "I loved your performance in that short film!",
    time: "Yesterday",
    unread: 0,
    online: false
  },
  {
    id: "3",
    name: "Emma Thompson",
    role: "Producer",
    avatar: "/placeholder.svg",
    lastMessage: "Let's discuss the contract details",
    time: "Monday",
    unread: 0,
    online: true
  },
  {
    id: "4",
    name: "David Chen",
    role: "Actor",
    avatar: "/placeholder.svg",
    lastMessage: "Are you going to the industry event next week?",
    time: "08/10/2023",
    unread: 0,
    online: false
  },
  {
    id: "5",
    name: "Jessica Lee",
    role: "Talent Agent",
    avatar: "/placeholder.svg",
    lastMessage: "I have a great opportunity for you",
    time: "08/05/2023",
    unread: 0,
    online: true
  }
];

// Dummy data for messages with Sarah Johnson
const dummyMessages = [
  {
    id: "m1",
    sender: "Sarah Johnson",
    content: "Hi James, I saw your profile and I'm impressed with your work!",
    time: "10:15 AM",
    isMe: false
  },
  {
    id: "m2",
    sender: "Me",
    content: "Thank you, Sarah! I'm glad you liked my portfolio.",
    time: "10:17 AM",
    isMe: true
  },
  {
    id: "m3",
    sender: "Sarah Johnson",
    content: "I'm working on a new indie film and I think you'd be perfect for one of the roles.",
    time: "10:20 AM",
    isMe: false
  },
  {
    id: "m4",
    sender: "Me",
    content: "That sounds interesting! I'd love to hear more about it.",
    time: "10:22 AM",
    isMe: true
  },
  {
    id: "m5",
    sender: "Sarah Johnson",
    content: "Great! It's a drama set in the 1960s. The character I'm thinking of is a struggling musician with a complicated past.",
    time: "10:25 AM",
    isMe: false
  },
  {
    id: "m6",
    sender: "Sarah Johnson",
    content: "Would you be able to send me an audition tape with a few scenes? I can send over the script excerpts.",
    time: "10:26 AM",
    isMe: false
  },
  {
    id: "m7",
    sender: "Me",
    content: "That sounds like a challenging role, I'm definitely interested! Yes, I can prepare an audition tape once I receive the script.",
    time: "10:28 AM",
    isMe: true
  },
  {
    id: "m8",
    sender: "Sarah Johnson",
    content: "When can you send the audition tape?",
    time: "10:30 AM",
    isMe: false
  }
];

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(dummyChats[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(dummyMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: `m${messages.length + 1}`,
      sender: "Me",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <Card className="h-[calc(100vh-120px)] border-none rounded-xl overflow-hidden shadow-2xl bg-card/95">
      <div className="flex h-full">
        {/* Chat List Sidebar */}
        <div className="w-1/3 md:w-1/4 border-r border-gold/10 flex flex-col">
          <CardHeader className="px-4 py-3 border-b border-gold/10 bg-card/90 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold gold-gradient-text">Messages</h2>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gold/5">
                <MoreVertical className="h-5 w-5 text-gold/70" />
              </Button>
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-10 bg-background/50 border-gold/10 focus-visible:ring-gold/30 rounded-full"
              />
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1">
            {dummyChats.map((chat) => (
              <div 
                key={chat.id}
                className={`p-3 cursor-pointer transition-all ${
                  selectedChat.id === chat.id 
                    ? 'bg-gold/5 hover:bg-gold/10 border-l-2 border-gold' 
                    : 'hover:bg-card/90 border-l-2 border-transparent'
                }`}
                onClick={() => setSelectedChat(chat)}
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
                      <h3 className={`font-medium truncate ${selectedChat.id === chat.id ? 'text-gold' : ''}`}>{chat.name}</h3>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-foreground/60" />
                        <span className="text-xs text-foreground/60 whitespace-nowrap">{chat.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 truncate">{chat.lastMessage}</p>
                    <p className="text-xs text-foreground/60 mt-1">{chat.role}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-gold text-black text-xs rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center ml-1">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        
        {/* Chat Area */}
        <div className="w-2/3 md:w-3/4 flex flex-col bg-gradient-to-br from-background/70 to-background/90">
          {/* Chat Header */}
          <CardHeader className="px-6 py-3 border-b border-gold/10 bg-card/40 backdrop-blur-sm flex-row items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-gold/10">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback className="bg-gold/10 text-gold">{selectedChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg gold-gradient-text">{selectedChat.name}</h3>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <span className={`h-2 w-2 rounded-full ${selectedChat.online ? 'bg-green-500' : 'bg-foreground/30'}`}></span>
                  <span>{selectedChat.online ? 'Online' : 'Offline'}</span>
                  <span>•</span>
                  <span>{selectedChat.role}</span>
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
              {messages.map((msg, index) => {
                // Check if this is the first message or if the previous message was from a different sender
                const isFirstMessage = index === 0 || messages[index - 1].isMe !== msg.isMe;
                // Group messages from the same sender
                const isLastInGroup = index === messages.length - 1 || messages[index + 1].isMe !== msg.isMe;
                
                return (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex ${msg.isMe ? 'flex-row-reverse' : 'flex-row'} gap-2 max-w-[75%]`}>
                      {!msg.isMe && isFirstMessage && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={selectedChat.avatar} />
                          <AvatarFallback className="bg-gold/10 text-gold">{selectedChat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      {!msg.isMe && !isFirstMessage && <div className="w-8"></div>}
                      <div>
                        <div 
                          className={`py-2.5 px-3.5 rounded-2xl ${
                            msg.isMe 
                              ? 'bg-gold/20 text-foreground rounded-br-none shadow-sm' 
                              : 'bg-card/80 border border-gold/5 rounded-bl-none shadow-sm'
                          } ${isFirstMessage ? 'mt-2' : 'mt-1'}`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        {isLastInGroup && (
                          <p className={`text-xs text-foreground/60 mt-1 px-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                            {msg.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <CardFooter className="p-4 border-t border-gold/10 bg-card/40 backdrop-blur-sm mt-auto">
            <form onSubmit={handleSendMessage} className="flex gap-2 w-full items-end">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 hover:bg-gold/10 flex-shrink-0"
              >
                <PaperclipIcon className="h-5 w-5 text-foreground/70" />
              </Button>
              <Textarea 
                placeholder="Type a message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-background/50 border-gold/10 focus-visible:ring-gold/30 rounded-lg min-h-[44px] max-h-[120px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                className="bg-gold hover:bg-gold/90 text-black rounded-full h-10 w-10 px-0 flex items-center justify-center flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default Chat;
