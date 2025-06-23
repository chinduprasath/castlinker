
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/integrations/firebase/client';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export interface Message {
  id: string;
  content: string;
  isMe: boolean;
  timestamp: string;
}

export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'offline';
}

export interface RoomInfo {
  name: string;
}

const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!roomId) return;

    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.text || data.content,
          isMe: data.userId === user?.id,
          timestamp: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        };
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [roomId, user]);

  const sendMessage = async (content: string) => {
    if (!user || !roomId) return;

    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    await addDoc(messagesRef, {
      text: content,
      content: content,
      createdAt: serverTimestamp(),
      userId: user.id,
      displayName: user.email || 'Unknown User',
      photoURL: '',
    });
  };

  const setTyping = (typing: boolean) => {
    setIsTyping(typing);
  };

  const loadMoreMessages = () => {
    // Implementation for loading more messages
  };

  const deleteMessage = (messageId: string) => {
    // Implementation for deleting messages
  };

  const editMessage = (messageId: string, newContent: string) => {
    // Implementation for editing messages
  };

  const addReaction = (messageId: string, reaction: string) => {
    // Implementation for adding reactions
  };

  const removeReaction = (messageId: string, reaction: string) => {
    // Implementation for removing reactions
  };

  const markAsRead = () => {
    // Implementation for marking messages as read
  };

  return { 
    messages, 
    sendMessage, 
    isLoading,
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
    markAsRead
  };
};

export default useChat;
