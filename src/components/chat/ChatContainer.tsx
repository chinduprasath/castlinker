import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat.tsx';

interface ChatContainerProps {
    roomId: string;
    participants: string[];
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ roomId, participants }) => {
    const {
        messages,
        sendMessage,
    } = useChat(roomId, participants);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#181818] border-l border-gray-200 dark:border-[#232323]">
            <div className="p-4 border-b border-gray-200 dark:border-[#232323] bg-white dark:bg-[#181818]">
                <h2 className="font-semibold text-gray-900 dark:text-white">Chat</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-white text-gray-900 dark:bg-[#181818] dark:text-white transition-colors">
                {messages.map((message) => (
                    <div key={message.id} className="mb-4">
                        <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-[80%] shadow ${message.isMe ? 'bg-yellow-400 text-gray-900 dark:bg-yellow-600 dark:text-black' : 'bg-gray-100 text-gray-900 dark:bg-[#232323] dark:text-white'}`}> 
                                <p>{message.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-[#232323] bg-white text-gray-900 dark:bg-[#181818] dark:text-white">
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
                            className="flex-1 border-none p-2 rounded-l-md bg-gray-100 text-gray-900 dark:bg-[#232323] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-600" 
                            placeholder="Type a message..." 
                        />
                        <button 
                            type="submit" 
                            className="bg-yellow-400 text-gray-900 dark:bg-yellow-600 dark:text-black p-2 rounded-r-md hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
