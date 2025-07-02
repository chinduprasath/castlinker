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
    <ScrollArea className="flex-1 p-6 bg-white text-gray-400 dark:bg-[#181818] dark:text-gray-300 transition-colors">
      {isLoading ? (
        <div className="flex justify-center p-4">
          <span>Loading messages...</span>
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
          <span>
            {chatRequestDeclined ? "You declined this chat request" : "No messages yet"}
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={{
                ...msg,
                sender_id: msg.senderId,
                created_at: msg.createdAt
                  ? (msg.createdAt.seconds
                      ? new Date(msg.createdAt.seconds * 1000).toISOString()
                      : msg.createdAt)
                  : '',
                type: 'text',
                isMe: msg.isMe,
                status: msg.status,
                content: msg.content,
              }}
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
