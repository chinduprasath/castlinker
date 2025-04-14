
import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
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

  const createNewChat = async () => {
    // Implementation for creating a new chat
    console.log("Creating new chat");
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
                {room.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {room.lastMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
