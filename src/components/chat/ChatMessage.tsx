import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import type { ChatMessage } from '@/hooks/useChat.tsx';
import { format } from 'date-fns';

// Define MediaAttachment from types
export interface Attachment {
  id: string;
  messageId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
}

// Custom reaction type that works with different formats
export interface MessageReaction {
  emoji: string;
  user_id: string;
  count: number;
}

type MessageProps = {
  message: ChatMessage;
  onEdit?: (messageId: string, content: string) => Promise<boolean>;
  onDelete?: (messageId: string, forEveryone: boolean) => Promise<boolean>;
  onReact?: (messageId: string, emoji: string) => Promise<boolean>;
  showAvatar?: boolean;
  isLastInGroup?: boolean;
};

export function ChatMessage({ 
  message, 
  onEdit, 
  onDelete, 
  onReact, 
  showAvatar = true, 
  isLastInGroup = true 
}: MessageProps) {
  return (
    <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} mb-4 group`}>
      {!message.isMe && showAvatar && (
        <Avatar className="h-10 w-10 mr-3 mt-1">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex flex-col max-w-[80%]">
        {/* No senderName or senderRole in ChatMessage type */}
        
        <div className={`p-4 rounded-2xl ${message.isMe 
          ? 'bg-gold/20 text-white rounded-tr-none' 
          : 'bg-[#222222] text-white rounded-tl-none'}`}
        >
          <p className="text-sm">{message.content}</p>
          
          {message.isEdited && (
            <span className="text-xs text-gold/40 mt-1 inline-block">(edited)</span>
          )}
        </div>
        
        <div className={`flex items-center mt-1 text-xs ${message.isMe ? 'justify-end' : 'justify-start'}`}>
          <span className="text-gray-400">
            {message.timestamp}
          </span>
          
          {message.isMe && message.status === 'seen' && (
            <div className="ml-1 text-blue-400">
              <Check size={14} />
            </div>
          )}
        </div>
      </div>
      
      {message.isMe && showAvatar && (
        <Avatar className="h-10 w-10 ml-3 mt-1">
          <AvatarImage src="/placeholder.svg" alt="You" />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
