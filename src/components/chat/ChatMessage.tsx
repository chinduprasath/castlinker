
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import { Message } from '@/types/chat';
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

// Define ChatMessage type that extends Message and adds the properties we need
export interface ChatMessage extends Message {
  senderName?: string;
  senderRole?: string;
  isMe?: boolean;
  status?: 'sent' | 'delivered' | 'seen';
  // Make reactions compatible with either format
  reactions?: Array<{
    emoji: string;
    user_id?: string;
    userId?: string;
    count?: number;
  }>;
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
          <AvatarImage src="/placeholder.svg" alt={message.senderName || 'User'} />
          <AvatarFallback>{(message.senderName || 'U').charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex flex-col max-w-[80%]">
        {!message.isMe && showAvatar && (
          <div className="mb-1 text-sm text-gold/80">
            {message.senderName && <span className="font-medium">{message.senderName}</span>}
            {message.senderRole && <span className="text-xs ml-2 text-gold/60">{message.senderRole}</span>}
          </div>
        )}
        
        <div className={`p-4 rounded-2xl ${message.isMe 
          ? 'bg-gold/20 text-white rounded-tr-none' 
          : 'bg-[#222222] text-white rounded-tl-none'}`}
        >
          <p className="text-sm">{message.content}</p>
          
          {message.is_edited && (
            <span className="text-xs text-gold/40 mt-1 inline-block">(edited)</span>
          )}
        </div>
        
        <div className={`flex items-center mt-1 text-xs ${message.isMe ? 'justify-end' : 'justify-start'}`}>
          <span className="text-gray-400">
            {message.created_at && format(new Date(message.created_at), 'h:mm a')}
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
          <AvatarFallback>{(message.senderName || 'Y').charAt(0)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
