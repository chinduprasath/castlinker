export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'system';

export interface Message {
    id: string;
    room_id: string;
    sender_id: string;
    content: string;
    type: MessageType;
    metadata: {
        fileName?: string;
        fileSize?: number;
        mimeType?: string;
        duration?: number;
        dimensions?: {
            width: number;
            height: number;
        };
    };
    created_at: string;
    updated_at: string;
    is_edited: boolean;
    is_deleted: boolean;
    reply_to_id?: string;
    reactions?: MessageReaction[];
}

export interface MessageReaction {
    emoji: string;
    user_id: string;
    count: number;
}

export interface ChatRoom {
    id: string;
    type: 'one_to_one' | 'group';
    name: string;
    created_at: string;
    updated_at: string;
    last_message_at: string;
    metadata: {
        description?: string;
        memberCount?: number;
        last_message?: string;
        unread_count?: number;
    };
}

export interface ChatRoomMember {
    id: string;
    room_id: string;
    user_id: string;
    role: 'admin' | 'member';
    joined_at: string;
    last_read_at: string;
    public_key: string;
    is_active: boolean;
    notifications_enabled: boolean;
}

export interface UserPresence {
    user_id: string;
    status: 'online' | 'away' | 'offline';
    last_active: string;
    typing_in_room?: string;
    typing_until?: string;
}

export interface MediaAttachment {
    id: string;
    message_id: string;
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    filename: string;
    size_bytes: number;
    mime_type: string;
    metadata: {
        width?: number;
        height?: number;
        duration?: number;
        thumbnail_url?: string;
    };
    encrypted_key: string;
    created_at: string;
} 