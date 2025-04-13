import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ChatContainer } from './ChatContainer';
import { ChatSidebar } from './ChatSidebar';
import { useAuth } from '../../hooks/useAuth';
import { E2EEncryption } from '../../utils/encryption';

export const ChatPage: React.FC = () => {
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const { user } = useAuth();
    const supabase = useSupabaseClient();

    useEffect(() => {
        if (!user) return;

        // Load user's chat rooms
        const loadRooms = async () => {
            const { data, error } = await supabase
                .from('chat_room_members')
                .select(`
                    room_id,
                    chat_rooms (
                        id,
                        type,
                        name,
                        last_message_at,
                        metadata
                    )
                `)
                .eq('user_id', user.id)
                .order('last_message_at', { ascending: false });

            if (data) {
                setRooms(data.map(room => room.chat_rooms));
            }
        };

        loadRooms();

        // Subscribe to new rooms
        const roomSubscription = supabase
            .channel('chat_rooms')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'chat_room_members',
                filter: `user_id=eq.${user.id}`
            }, payload => {
                loadRooms();
            })
            .subscribe();

        return () => {
            roomSubscription.unsubscribe();
        };
    }, [user]);

    return (
        <div className="flex h-screen bg-gray-100">
            <ChatSidebar
                rooms={rooms}
                selectedRoom={selectedRoom}
                onRoomSelect={setSelectedRoom}
            />
            <div className="flex-1">
                {selectedRoom ? (
                    <ChatContainer roomId={selectedRoom} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                            Select a chat to start messaging
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}; 