import React, { useEffect, useState, useRef } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../../hooks/useAuth';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { useChat } from '../../hooks/useChat';
import { Message } from '../../types/chat';

interface ChatContainerProps {
    roomId: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ roomId }) => {
    const {
        messages,
        sendMessage,
        isTyping,
        onlineUsers,
        setTyping,
        roomInfo,
        loadMoreMessages,
        hasMoreMessages,
        markAsRead,
        deleteMessage,
        editMessage,
        addReaction,
        removeReaction,
    } = useChat(roomId);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom();
        }
    }, [messages]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        
        // Check if we're at the bottom
        setIsAtBottom(Math.abs(scrollHeight - clientHeight - scrollTop) < 1);

        // Check if we're at the top to load more messages
        if (scrollTop === 0 && hasMoreMessages) {
            loadMoreMessages();
        }
    };

    const handleSend = async (content: string, attachments: File[]) => {
        await sendMessage(content, attachments);
        scrollToBottom();
    };

    const handleDelete = async (messageId: string, forEveryone: boolean) => {
        await deleteMessage(messageId, forEveryone);
    };

    const handleEdit = async (messageId: string, newContent: string) => {
        await editMessage(messageId, newContent);
    };

    const handleReaction = async (messageId: string, emoji: string) => {
        await addReaction(messageId, emoji);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <ChatHeader
                roomInfo={roomInfo}
                onlineUsers={onlineUsers}
            />
            <div 
                className="flex-1 overflow-y-auto p-4"
                onScroll={handleScroll}
            >
                <MessageList
                    messages={messages}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onReaction={handleReaction}
                    onRemoveReaction={removeReaction}
                />
                <div ref={messagesEndRef} />
            </div>
            <MessageInput
                onSend={handleSend}
                onTyping={setTyping}
                showTypingIndicator={isTyping}
            />
        </div>
    );
}; 