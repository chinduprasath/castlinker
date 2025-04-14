
import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Picker from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emoji: any) => {
    onSelect(emoji.emoji);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          className="text-gray-400 hover:text-gray-200 p-1 rounded transition-colors"
          aria-label="Select emoji"
        >
          <Smile size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 border-gray-700 bg-gray-800 w-auto"
        side="top"
        align="end"
      >
        <Picker 
          onEmojiClick={handleEmojiClick} 
          theme="dark" as Theme
        />
      </PopoverContent>
    </Popover>
  );
}
