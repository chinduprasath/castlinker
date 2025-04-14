
// These types match our Supabase database schema
export interface ChatRoom {
  id: string;
  name: string;
  type: 'one_to_one' | 'group';
  created_at: string;
  updated_at: string;
  last_message_at: string;
  metadata: {
    description?: string;
    memberCount?: number;
    last_message?: string;
    unread_count?: number;
  };
  users?: UserProfile[];
}

export interface ChatRoomMember {
  id: string;
  room_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  last_read_at: string;
  public_key?: string;
  is_active: boolean;
  notifications_enabled: boolean;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'system';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  is_deleted: boolean;
  reply_to_id?: string;
  sender?: UserProfile;
}

export interface MessageReaction {
  emoji: string;
  user_id: string;
  count: number;
}

export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'offline';
  last_active: string;
  typing_in_room?: string;
  typing_until?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  role?: string;
  location?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}
