
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Check, 
  CheckCheck, 
  Edit, 
  FileIcon, 
  Image as ImageIcon, 
  MoreVertical, 
  SmilePlus, 
  Trash, 
  X 
} from 'lucide-react';

// Define types locally instead of importing
interface Attachment {
  id: string;
  messageId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
}

interface MessageProps {
  message: any; // Use any temporarily to fix type issues
  onEdit: (messageId: string, content: string) => Promise<boolean>;
  onDelete: (messageId: string, forEveryone: boolean) => Promise<boolean>;
  onReact: (messageId: string, emoji: string) => Promise<boolean>;
  showAvatar?: boolean;
  isLastInGroup?: boolean;
}

export function ChatMessage({ 
  message, 
  onEdit, 
  onDelete, 
  onReact, 
  showAvatar = true, 
  isLastInGroup = true 
}: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Common emojis for quick reactions
  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '👏', '🔥'];

  // Start editing a message
  const startEditing = () => {
    setEditContent(message.content);
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(message.content.length, message.content.length);
      }
    }, 50);
  };

  // Save edited message
  const saveEdit = async () => {
    if (editContent.trim() === message.content) {
      setIsEditing(false);
      return;
    }

    const success = await onEdit(message.id, editContent.trim());
    if (success) {
      setIsEditing(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  // Render status indicator
  const renderStatus = () => {
    if (!message.isMe) return null;
    
    switch (message.status) {
      case 'sent':
        return <Check className="h-3.5 w-3.5 text-foreground/60" />;
      case 'delivered':
        return <CheckCheck className="h-3.5 w-3.5 text-foreground/60" />;
      case 'seen':
        return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
      default:
        return null;
    }
  };

  // Render attachment
  const renderAttachment = (attachment: Attachment) => {
    if (attachment.fileType.startsWith('image/')) {
      return (
        <div className="mt-2 relative rounded-lg overflow-hidden">
          <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
            <img 
              src={attachment.thumbnailUrl || attachment.fileUrl} 
              alt={attachment.fileName}
              className="max-w-full max-h-56 rounded-lg object-contain bg-background/50"
            />
          </a>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {(attachment.fileSize / 1024).toFixed(1)} KB
          </div>
        </div>
      );
    } else {
      // For non-image files
      return (
        <a 
          href={attachment.fileUrl} 
          download={attachment.fileName}
          className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
        >
          <FileIcon className="h-10 w-10 text-foreground/70" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{attachment.fileName}</p>
            <p className="text-xs text-foreground/60">{(attachment.fileSize / 1024).toFixed(1)} KB</p>
          </div>
        </a>
      );
    }
  };

  // Editing interface
  if (isEditing) {
    return (
      <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'} mt-1`}>
        <div className="w-full max-w-[75%]">
          <Textarea
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[80px] bg-background/50 border-gold/10"
            placeholder="Edit your message..."
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={cancelEdit}
              className="h-8 px-3"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              onClick={saveEdit}
              size="sm"
              className="h-8 px-3 bg-gold hover:bg-gold/90 text-black"
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex ${message.isMe ? 'flex-row-reverse' : 'flex-row'} gap-2 max-w-[75%] group`}>
        {!message.isMe && showAvatar ? (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gold/10 text-gold">S</AvatarFallback>
          </Avatar>
        ) : showAvatar && <div className="w-8"></div>}
        
        <div className="relative">
          {/* Message bubble */}
          <div 
            className={`py-2.5 px-3.5 rounded-2xl ${
              message.isMe 
                ? 'bg-gold/20 text-foreground rounded-br-none shadow-sm' 
                : 'bg-card/80 border border-gold/5 rounded-bl-none shadow-sm'
            } ${showAvatar ? 'mt-2' : 'mt-1'}`}
          >
            {message.is_deleted ? (
              <p className="text-sm italic text-foreground/60">{message.content}</p>
            ) : (
              <>
                <p className="text-sm">{message.content}</p>
                
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-1 space-y-2">
                    {message.attachments.map((attachment: Attachment) => (
                      <div key={attachment.id}>
                        {renderAttachment(attachment)}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {Array.from(new Set(message.reactions.map((r: any) => r.emoji))).map((emoji: string) => {
                      const count = message.reactions?.filter((r: any) => r.emoji === emoji).length || 0;
                      return (
                        <div 
                          key={emoji} 
                          className="bg-background/30 text-xs rounded-full py-0.5 px-2 flex items-center"
                        >
                          <span>{emoji}</span>
                          {count > 1 && <span className="ml-1 text-foreground/70">{count}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Message actions */}
          {!message.is_deleted && (
            <div className={`absolute ${message.isMe ? 'left-0' : 'right-0'} top-0 -m-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <div className="flex items-center bg-card/95 border border-border rounded-full shadow-md">
                {/* Emoji reaction button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full" 
                        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                      >
                        <SmilePlus className="h-4 w-4 text-foreground/70" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Add reaction</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Message menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreVertical className="h-4 w-4 text-foreground/70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={message.isMe ? "end" : "start"}>
                    {message.sender_id === message.user?.id && (
                      <>
                        <DropdownMenuItem onClick={startEditing}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(message.id, true)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete for everyone
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(message.id, false)}>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete for me
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Quick emoji reactions */}
              {emojiPickerOpen && (
                <div className="absolute top-8 bg-card/95 border border-border rounded-full p-1 shadow-lg flex z-10">
                  {quickEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      className="h-8 w-8 flex items-center justify-center hover:bg-background/50 rounded-full text-lg"
                      onClick={() => {
                        onReact(message.id, emoji);
                        setEmojiPickerOpen(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Message info */}
          {isLastInGroup && (
            <div className={`flex items-center text-xs text-foreground/60 mt-1 px-1 ${message.isMe ? 'justify-end' : 'justify-start'}`}>
              {message.is_edited && <span className="mr-1 italic">Edited</span>}
              <span>{message.created_at}</span>
              {renderStatus()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
