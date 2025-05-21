
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/chat/ChatMessage";
import ChatRequestCard from "@/components/chat/ChatRequestCard";

interface ChatMessageAreaProps {
  messages: any[];
  isLoading: boolean;
  showChatRequest: boolean;
  chatRequestDeclined: boolean;
  senderName: string;
  onAcceptChat: () => void;
  onDeclineChat: () => void;
}

const ChatMessageArea = ({
  messages,
  isLoading,
  showChatRequest,
  chatRequestDeclined,
  senderName,
  onAcceptChat,
  onDeclineChat
}: ChatMessageAreaProps) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-6">
      {isLoading ? (
        <div className="flex justify-center p-4">
          <span className="text-gray-400">Loading messages...</span>
        </div>
      ) : showChatRequest ? (
        <div className="flex justify-center items-center h-full">
          <ChatRequestCard 
            senderName={senderName}
            onAccept={onAcceptChat}
            onDecline={onDeclineChat}
          />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex justify-center p-4">
          <span className="text-gray-400">
            {chatRequestDeclined ? "You declined this chat request" : "No messages yet"}
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              showAvatar={true}
              isLastInGroup={true}
            />
          ))}
          <div ref={messageEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatMessageArea;
