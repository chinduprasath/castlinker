import React from 'react';
import { format } from 'date-fns';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useAuth } from '../../hooks/useAuth';

interface ChatRoom {
    id: string;
    type: 'one_to_one' | 'group';
    name: string;
    last_message_at: string;
    metadata: {
        last_message?: string;
        unread_count?: number;
    };
}

interface ChatSidebarProps {
    rooms: ChatRoom[];
    selectedRoom: string | null;
    onRoomSelect: (roomId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    rooms,
    selectedRoom,
    onRoomSelect
}) => {
    const { user } = useAuth();
    const supabase = useSupabaseClient();

    const createNewChat = async () => {
        // TODO: Implement new chat creation
    };

    return (
        <div className="w-80 bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <button
                    onClick={createNewChat}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                    New Chat
                </button>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-73px)]">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                            selectedRoom === room.id ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => onRoomSelect(room.id)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {room.name}
                                </h3>
                                {room.metadata.last_message && (
                                    <p className="text-sm text-gray-500 truncate">
                                        {room.metadata.last_message}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col items-end">
                                {room.last_message_at && (
                                    <span className="text-xs text-gray-500">
                                        {format(
                                            new Date(room.last_message_at),
                                            'MMM d, h:mm a'
                                        )}
                                    </span>
                                )}
                                {room.metadata.unread_count > 0 && (
                                    <span className="mt-1 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                                        {room.metadata.unread_count}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 