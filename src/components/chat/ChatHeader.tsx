
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, Info } from "lucide-react";

interface ChatHeaderProps {
  chat: {
    name: string;
    avatar: string;
    online?: boolean;
    role?: string;
  } | null;
}

const ChatHeader = ({ chat }: ChatHeaderProps) => {
  if (!chat) return null;

  return (
    <div className="p-4 border-b border-white/10 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback className="bg-gold/20 text-gold">{chat.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold text-gold">{chat.name}</h2>
          <div className="flex items-center gap-2">
            {chat.online && (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-300">Online</span>
              </>
            )}
            {chat.role && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-300">{chat.role}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full text-gold hover:bg-gold/10"
        >
          <Phone size={20} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full text-gold hover:bg-gold/10"
        >
          <Video size={20} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full text-gold hover:bg-gold/10"
        >
          <Info size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
