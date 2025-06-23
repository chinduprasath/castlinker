import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import useChat, { Message, UserPresence } from '@/hooks/useChat';

interface ChatContainerProps {
    roomId: string;
}

// Define a minimal OnlineUser type for compatibility
interface OnlineUser {
    id: string;
    name: string;
    status: 'online' | 'away' | 'offline';
}

// Convert UserPresence to OnlineUser for compatibility
const convertToOnlineUser = (presence: UserPresence): OnlineUser => {
    return {
        id: presence.user_id,
        name: presence.user_id, // In a real app, we'd fetch the name
        status: presence.status
    };
};

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
        deleteMessage,
        editMessage,
        addReaction,
        removeReaction,
        markAsRead,
    } = useChat(roomId);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Call markAsRead when component mounts
    useEffect(() => {
        if (roomId) {
            markAsRead();
        }
    }, [roomId]);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="font-semibold">{roomInfo?.name || 'Chat'}</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                    <div key={message.id} className="mb-4">
                        <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-[80%] ${message.isMe ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>
                                <p>{message.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            
            <div className="p-4 border-t">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                    if (input.value.trim()) {
                        sendMessage(input.value);
                        input.value = '';
                    }
                }}>
                    <div className="flex">
                        <input 
                            name="message" 
                            className="flex-1 border p-2 rounded-l-md" 
                            placeholder="Type a message..." 
                            onFocus={() => setTyping(true)}
                            onBlur={() => setTyping(false)}
                        />
                        <button 
                            type="submit" 
                            className="bg-blue-500 text-white p-2 rounded-r-md"
                        >
                            Send
                        </button>
                    </div>
                </form>
                {isTyping && <p className="text-sm text-gray-500 mt-1">Someone is typing...</p>}
            </div>
        </div>
    );
};
