
import { db } from '@/integrations/firebase/client';
import { collection, getDocs, addDoc, query, orderBy, where, onSnapshot } from 'firebase/firestore';

export interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  recipient_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  conversation_id: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participant_names: string[];
  participant_avatars: string[];
  last_message: string;
  last_message_timestamp: string;
  unread_count: number;
}

export const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    // Mock data for testing
    return [
      {
        id: '1',
        participants: ['user123', 'user456'],
        participant_names: ['Sarah Johnson'],
        participant_avatars: ['/placeholder.svg'],
        last_message: 'Thanks for the audition opportunity!',
        last_message_timestamp: new Date(Date.now() - 3600000).toISOString(),
        unread_count: 2
      },
      {
        id: '2',
        participants: ['user123', 'user789'],
        participant_names: ['Michael Chen'],
        participant_avatars: ['/placeholder.svg'],
        last_message: 'When can we schedule the callback?',
        last_message_timestamp: new Date(Date.now() - 7200000).toISOString(),
        unread_count: 0
      },
      {
        id: '3',
        participants: ['user123', 'user101'],
        participant_names: ['Emma Davis'],
        participant_avatars: ['/placeholder.svg'],
        last_message: 'Great work on the demo reel!',
        last_message_timestamp: new Date(Date.now() - 86400000).toISOString(),
        unread_count: 1
      }
    ];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    // Mock data for testing
    return [
      {
        id: '1',
        sender_id: 'user456',
        sender_name: 'Sarah Johnson',
        sender_avatar: '/placeholder.svg',
        recipient_id: 'user123',
        content: 'Hi! I saw your profile and I think you\'d be perfect for our upcoming production.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        conversation_id: conversationId
      },
      {
        id: '2',
        sender_id: 'user123',
        sender_name: 'You',
        recipient_id: 'user456',
        content: 'Thank you so much! I\'d love to hear more about the project.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        conversation_id: conversationId
      },
      {
        id: '3',
        sender_id: 'user456',
        sender_name: 'Sarah Johnson',
        sender_avatar: '/placeholder.svg',
        recipient_id: 'user123',
        content: 'Thanks for the audition opportunity!',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false,
        conversation_id: conversationId
      }
    ];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const sendMessage = async (messageData: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<string> => {
  try {
    const messagesRef = collection(db, 'messages');
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      timestamp: new Date().toISOString(),
      read: false
    });
    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
