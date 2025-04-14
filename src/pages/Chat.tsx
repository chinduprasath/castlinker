
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: "1", sender: "Sarah", content: "Hi there! How's your project coming along?", isMe: false },
    { id: "2", sender: user?.email || "You", content: "It's going well, thanks for asking!", isMe: true },
    { id: "3", sender: "Sarah", content: "That's great to hear! Let me know if you need any help with casting.", isMe: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { 
          id: Date.now().toString(), 
          sender: user?.email || "You", 
          content: newMessage, 
          isMe: true 
        },
      ]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="h-[calc(100vh-120px)] border-none rounded-xl overflow-hidden shadow-2xl bg-card/95">
      <CardHeader className="px-6 py-3 border-b border-gold/10 bg-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gold/10">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gold/10 text-gold">S</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg gold-gradient-text">Sarah Johnson</h3>
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span>Online</span>
              <span>•</span>
              <span>Casting Director</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-220px)] p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex ${message.isMe ? "flex-row-reverse" : "flex-row"} gap-2 max-w-[75%] group`}>
                  {!message.isMe && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gold/10 text-gold">S</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="relative">
                    <div 
                      className={`py-2.5 px-3.5 rounded-2xl ${
                        message.isMe 
                          ? 'bg-gold/20 text-foreground rounded-br-none shadow-sm' 
                          : 'bg-card/80 border border-gold/5 rounded-bl-none shadow-sm'
                      } mt-1`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="p-4 border-t border-gold/10 bg-card/40 backdrop-blur-sm mt-auto">
        <div className="flex items-center w-full gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="bg-background/50 border-gold/10 focus-visible:ring-gold/30"
          />
          <Button 
            onClick={handleSend} 
            className="rounded-full h-10 w-10 p-2.5 bg-gold hover:bg-gold/90 text-black"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chat;
