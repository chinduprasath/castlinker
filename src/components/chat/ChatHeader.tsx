import React from 'react';

interface RoomInfo {
    id: string;
    type: 'one_to_one' | 'group';
    name: string;
    metadata: {
        memberCount?: number;
        description?: string;
    };
}

interface OnlineUser {
    id: string;
    name: string;
    avatar_url?: string;
}

interface ChatHeaderProps {
    roomInfo: RoomInfo;
    onlineUsers: OnlineUser[];
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    roomInfo,
    onlineUsers,
}) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {roomInfo.name}
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                            {roomInfo.type === 'group'
                                ? `${roomInfo.metadata.memberCount || 0} members`
                                : ''}
                        </span>
                        {onlineUsers.length > 0 && (
                            <span className="text-sm text-green-600">
                                {onlineUsers.length} online
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                    {onlineUsers.slice(0, 3).map((user) => (
                        <div
                            key={user.id}
                            className="relative"
                            title={user.name}
                        >
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full border-2 border-white"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">
                                        {user.name[0]}
                                    </span>
                                </div>
                            )}
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                    ))}
                    {onlineUsers.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-gray-600">
                                +{onlineUsers.length - 3}
                            </span>
                        </div>
                    )}
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700">
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
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}; 