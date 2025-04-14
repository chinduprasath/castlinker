
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: File[]) => Promise<any>;
  onTyping?: () => void;
}

export function ChatInput({ onSendMessage, onTyping }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle user typing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (onTyping) {
      onTyping();
    }
  };
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  // Remove a file from selection
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && selectedFiles.length === 0) || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSendMessage(message, selectedFiles.length > 0 ? selectedFiles : undefined);
      
      // Clear inputs on successful send
      setMessage('');
      setSelectedFiles([]);
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
      {/* Selected files preview */}
      {selectedFiles.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {selectedFiles.map((file, index) => (
            <div 
              key={`${file.name}-${index}`} 
              className="flex items-center gap-2 bg-background/80 rounded-full px-3 py-1 border border-border"
            >
              <span className="text-xs truncate max-w-[100px]">{file.name}</span>
              <button 
                type="button"
                className="text-foreground/60 hover:text-foreground"
                onClick={() => removeFile(index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Message input and buttons */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5 text-gold/80" />
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  onChange={handleFileSelect}
                  className="hidden" 
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Attach files</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Input
          className="flex-1"
          placeholder="Type a message..."
          value={message}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className={`flex-shrink-0 ${!message.trim() && selectedFiles.length === 0 ? 'text-foreground/60' : 'text-gold'}`}
                disabled={(!message.trim() && selectedFiles.length === 0) || isSubmitting}
              >
                <Send className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </form>
  );
}
