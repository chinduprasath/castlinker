import React, { useState, useRef, useEffect } from 'react';
import { EmojiPicker } from './EmojiPicker';

interface MessageInputProps {
    onSend: (content: string, attachments: File[]) => Promise<void>;
    onTyping: (isTyping: boolean) => void;
    showTypingIndicator: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
    onSend,
    onTyping,
    showTypingIndicator,
}) => {
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleTyping = () => {
        onTyping(true);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
            onTyping(false);
        }, 3000);
    };

    const handleSend = async () => {
        if (message.trim() || attachments.length > 0) {
            await onSend(message.trim(), attachments);
            setMessage('');
            setAttachments([]);
            onTyping(false);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setAttachments((prev) => [...prev, ...files]);
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleEmojiSelect = (emoji: string) => {
        setMessage((prev) => prev + emoji);
        setIsEmojiPickerOpen(false);
    };

    return (
        <div className="border-t border-gray-200 p-4">
            {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {attachments.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded"
                        >
                            <span className="text-sm truncate max-w-[150px]">
                                {file.name}
                            </span>
                            <button
                                onClick={() => handleRemoveAttachment(index)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                    <textarea
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            handleTyping();
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full p-2 border rounded-lg resize-none min-h-[40px] max-h-[120px]"
                        rows={1}
                    />
                    {showTypingIndicator && (
                        <div className="absolute -top-6 left-2 text-xs text-gray-500">
                            Someone is typing...
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                        </svg>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        multiple
                    />
                    <div className="relative">
                        <button
                            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            😊
                        </button>
                        {isEmojiPickerOpen && (
                            <div className="absolute bottom-full right-0 mb-2">
                                <EmojiPicker onSelect={handleEmojiSelect} />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() && attachments.length === 0}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}; 