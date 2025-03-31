import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Phone, Video, Info, Search, PaperclipIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
    <Card className="h-[calc(100vh-120px)] border-gold/10 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
      <div className="flex h-full">
        {/* Chat List Sidebar */}
        <div className="w-1/3 border-r border-gold/10 flex flex-col bg-card/70">
          <CardHeader className="px-4 py-4 border-b border-gold/10 bg-gradient-to-r from-gold/5 to-transparent">
            <h2 className="text-xl font-bold">Conversations</h2>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-10 bg-background/50 border-gold/10 focus-visible:ring-gold/30"
              />
            </div>
          </CardHeader>
          
          <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gold/10">
            {dummyChats.map((chat) => (
              <div 
                key={chat.id}
                className={`p-4 border-b border-gold/5 cursor-pointer transition-colors ${
                  selectedChat.id === chat.id 
                    ? 'bg-gold/5 hover:bg-gold/10' 
                    : 'hover:bg-card/90'
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
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      <span className="text-xs text-foreground/60 whitespace-nowrap ml-2">{chat.time}</span>
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
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="w-2/3 flex flex-col bg-gradient-to-br from-background/50 to-card/20">
          {/* Chat Header */}
          <CardHeader className="px-6 py-4 border-b border-gold/10 bg-card/40 backdrop-blur-sm flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border border-gold/10">
                <AvatarImage src={selectedChat.avatar} />
                <AvatarFallback className="bg-gold/10 text-gold">{selectedChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{selectedChat.name}</h3>
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <span className={`h-2 w-2 rounded-full ${selectedChat.online ? 'bg-green-500' : 'bg-foreground/30'}`}></span>
                  <span>{selectedChat.online ? 'Online' : 'Offline'}</span>
                  <span>•</span>
                  <span>{selectedChat.role}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-card/60 h-9 w-9">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-card/60 h-9 w-9">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-card/60 h-9 w-9">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gold/10">
            {messages.map((msg, index) => {
              // Check if this is the first message or if the previous message was from a different sender
              const isFirstMessage = index === 0 || messages[index - 1].isMe !== msg.isMe;
              
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
                            ? 'bg-gold/20 text-foreground rounded-tr-none' 
                            : 'bg-card/80 border border-gold/5 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className="text-xs text-foreground/60 mt-1 px-1 flex justify-end">
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
          
          {/* Message Input - Adjusted to stay at the bottom */}
          <CardFooter className="p-4 border-t border-gold/10 bg-card/40 backdrop-blur-sm mt-auto">
            <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 hover:bg-gold/10"
              >
                <PaperclipIcon className="h-5 w-5 text-foreground/70" />
              </Button>
              <Input 
                placeholder="Type a message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-background/50 border-gold/10 focus-visible:ring-gold/30 rounded-full"
              />
              <Button 
                type="submit" 
                className="bg-gold hover:bg-gold/90 text-black rounded-full h-10 w-10 px-0 flex items-center justify-center"
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
