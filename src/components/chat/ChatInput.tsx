
import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  PaperclipIcon, 
  Send, 
  Smile,
  Image as ImageIcon,
  File,
  Mic,
  Video,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ChatInputProps = {
  onSendMessage: (content: string, attachments?: File[]) => Promise<boolean>;
  onTyping: () => void;
  disabled?: boolean;
};

export function ChatInput({ onSendMessage, onTyping, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle text input changes
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onTyping();
  };
  
  // Handle sending a message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if ((!message.trim() && attachments.length === 0) || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const success = await onSendMessage(message, attachments.length > 0 ? attachments : undefined);
      if (success) {
        setMessage('');
        setAttachments([]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle file attachment
  const handleFileAttachment = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
      
      // Clear input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Handle removing an attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Format file size
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <form onSubmit={handleSendMessage} className="w-full">
      {/* Attachment previews */}
      {attachments.length > 0 && (
        <div className="mb-2 p-2 bg-background/30 rounded-lg border border-border/50">
          <div className="text-xs font-medium mb-1 flex justify-between">
            <span>Attachments ({attachments.length})</span>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-5 px-1.5 text-xs"
              onClick={() => setAttachments([])}
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div 
                key={index} 
                className="relative bg-background/50 rounded p-2 flex items-center gap-2 pr-8"
              >
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                ) : (
                  <File className="h-4 w-4 text-amber-500" />
                )}
                <div className="text-xs">
                  <div className="font-medium truncate max-w-[150px]">{file.name}</div>
                  <div className="text-foreground/60">{formatFileSize(file.size)}</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 absolute right-1 top-1 text-foreground/60 hover:text-foreground"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="flex gap-2 w-full items-end">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileAttachment}
          className="hidden"
          multiple
        />
        
        {/* Attachment button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-10 w-10 hover:bg-gold/10 flex-shrink-0"
              disabled={disabled}
            >
              <PaperclipIcon className="h-5 w-5 text-foreground/70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
              Images
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <File className="h-4 w-4 mr-2 text-amber-500" />
              Documents
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Mic className="h-4 w-4 mr-2 text-red-500" />
              Audio message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Message input */}
        <Textarea 
          placeholder="Type a message..." 
          value={message}
          onChange={handleChange}
          disabled={disabled}
          className="bg-background/50 border-gold/10 focus-visible:ring-gold/30 rounded-lg min-h-[44px] max-h-[120px] resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        
        {/* Emoji button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 hover:bg-gold/10 flex-shrink-0"
                disabled={disabled}
              >
                <Smile className="h-5 w-5 text-foreground/70" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Add emoji</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Send button */}
        <Button 
          type="submit" 
          className="bg-gold hover:bg-gold/90 text-black rounded-full h-10 w-10 px-0 flex items-center justify-center flex-shrink-0"
          disabled={(!message.trim() && attachments.length === 0) || isSubmitting || disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
