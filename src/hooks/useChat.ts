
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { E2EEncryption } from '../utils/encryption';

// Define types to match those used in the codebase
export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'system';
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
  // Additional properties to support existing code
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'seen';
  isMe?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  messageId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
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

export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'offline';
  last_active: string;
  typing_in_room?: string;
  typing_until?: string;
}

export interface OnlineUser {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
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

// Mock implementation for chat functionality
export const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const encryption = new E2EEncryption();

  // Load initial messages
  useEffect(() => {
    if (!roomId || !user) return;

    const loadMockData = async () => {
      setIsLoading(true);
      
      // Mock room data
      const mockRoom: ChatRoom = {
        id: roomId,
        type: 'one_to_one',
        name: 'Chat Room',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
        metadata: {
          description: 'A chat room',
          memberCount: 2,
          last_message: 'Hello',
          unread_count: 0
        }
      };
      
      // Mock messages
      const mockMessages: Message[] = [
        {
          id: uuidv4(),
          room_id: roomId,
          sender_id: 'other-user',
          content: 'Hello there!',
          type: 'text',
          metadata: {},
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          is_edited: false,
          is_deleted: false,
          timestamp: '1 hour ago',
          status: 'seen',
          isMe: false
        },
        {
          id: uuidv4(),
          room_id: roomId,
          sender_id: user.id,
          content: 'Hi! How are you?',
          type: 'text',
          metadata: {},
          created_at: new Date(Date.now() - 1800000).toISOString(),
          updated_at: new Date(Date.now() - 1800000).toISOString(),
          is_edited: false,
          is_deleted: false,
          timestamp: '30 minutes ago',
          status: 'seen',
          isMe: true
        }
      ];
      
      setRoomInfo(mockRoom);
      setMessages(mockMessages);
      setIsLoading(false);
    };

    loadMockData();
  }, [roomId, user]);

  // Send message function
  const sendMessage = async (content: string, attachments: File[] = []) => {
    if (!user || !content.trim()) return;

    const newMessage: Message = {
      id: uuidv4(),
      room_id: roomId,
      sender_id: user.id,
      content,
      type: 'text',
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_edited: false,
      is_deleted: false,
      timestamp: 'Just now',
      status: 'sent',
      isMe: true
    };

    // If there are attachments, add them to the message
    if (attachments.length > 0) {
      newMessage.attachments = attachments.map(file => ({
        id: uuidv4(),
        messageId: newMessage.id,
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      }));
    }

    setMessages(prev => [...prev, newMessage]);
    return true;
  };

  // Update typing status
  const setTyping = async (typing: boolean) => {
    setIsTyping(typing);
    return true;
  };

  // Load more messages
  const loadMoreMessages = async () => {
    setHasMoreMessages(false);
    return true;
  };

  // Mark message as read
  const markAsRead = async () => {
    return true;
  };

  // Delete message
  const deleteMessage = async (messageId: string, forEveryone = false) => {
    if (forEveryone) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: 'This message was deleted', is_deleted: true, attachments: undefined, reactions: undefined } 
          : msg
      ));
    } else {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
    return true;
  };

  // Edit message
  const editMessage = async (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, is_edited: true } 
        : msg
    ));
    return true;
  };

  // Add reaction to message
  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return false;
    
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReactions = msg.reactions || [];
        const filteredReactions = existingReactions.filter(r => r.userId !== user.id);
        
        return {
          ...msg,
          reactions: [...filteredReactions, { userId: user.id, emoji }]
        };
      }
      return msg;
    }));
    
    return true;
  };

  // Remove reaction from message
  const removeReaction = async (messageId: string, emoji: string) => {
    if (!user) return false;
    
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReactions = msg.reactions || [];
        return {
          ...msg,
          reactions: existingReactions.filter(r => !(r.userId === user.id && r.emoji === emoji))
        };
      }
      return msg;
    }));
    
    return true;
  };

  return {
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
    isLoading,
  };
};
