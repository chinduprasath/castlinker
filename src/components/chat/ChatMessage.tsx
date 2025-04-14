
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ThumbsUp } from 'lucide-react';
import { Message, Attachment as MessageAttachment } from '@/hooks/useChat';

// Define Attachment type for ChatMessage component that is compatible with useChat's Attachment
export interface Attachment extends MessageAttachment {
  // Already contains all needed fields from useChat.Attachment
}

// Define ChatMessage type that extends Message from useChat
export interface ChatMessage extends Omit<Message, 'attachments'> {
  // Override attachments with our local type
  attachments?: Attachment[];
  isMe?: boolean;
}

type MessageProps = {
  message: ChatMessage;
  onEdit: (messageId: string, content: string) => Promise<boolean>;
  onDelete: (messageId: string, forEveryone: boolean) => Promise<boolean>;
  onReact: (messageId: string, emoji: string) => Promise<boolean>;
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
  // Simple implementation for now
  return (
    <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} mb-4`}>
      {!message.isMe && showAvatar && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`p-3 rounded-lg ${message.isMe ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <p>{message.content}</p>
        
        {message.is_edited && (
          <span className="text-xs text-gray-500">(edited)</span>
        )}
        
        <div className="flex gap-2 mt-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onReact(message.id, '👍')}
          >
            <ThumbsUp size={16} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(message.id, false)}
          >
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
