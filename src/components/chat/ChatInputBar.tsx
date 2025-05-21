
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { EmojiPicker } from "@/components/chat/EmojiPicker";

interface ChatInputBarProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInputBar = ({ onSendMessage, disabled }: ChatInputBarProps) => {
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
  };

  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Input 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="bg-[#222222] border-0 text-white placeholder:text-gray-400 focus-visible:ring-gold/30 pr-10"
            disabled={disabled}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <EmojiPicker onSelect={handleEmojiSelect} />
          </div>
        </div>
        <Button 
          onClick={handleSendMessage} 
          className="rounded-full bg-gold hover:bg-gold/90 text-black"
          disabled={disabled}
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputBar;
