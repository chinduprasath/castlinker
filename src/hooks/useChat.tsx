import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/integrations/firebase/client';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

export type ChatUser = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  lastSeen: string | null;
  unreadCount: number;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  recipientId: string | null;
  chatId: string | null;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
  isMe: boolean;
  attachments?: Attachment[] | undefined;
  reactions?: Reaction[];
  isEdited: boolean;
  isDeleted: boolean;
};

export type Chat = {
  id: string;
  name: string;
  participants: string[];
  isGroup: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  avatar: string;
  role?: string;
  online?: boolean;
};

export type Attachment = {
  id: string;
  messageId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
};

export type Reaction = {
  userId: string;
  emoji: string;
};

export const useChat = (chatId: string, participants: string[] = []) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'active'>('newest');
  const [userTyping, setUserTyping] = useState<{userId: string, chatId: string} | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!user) return;
    
    const loadChats = async () => {
      setIsLoading(true);
      try {
        const dummyChats = [
          {
            id: "1",
            name: "Sarah Johnson",
            participants: [user.id, "user123"],
            isGroup: false,
            lastMessage: "When can you send the audition tape?",
            lastMessageTime: "10:30 AM",
            unread: 2,
            avatar: "/placeholder.svg",
            role: "Casting Director",
            online: true
          },
          {
            id: "2",
            name: "Michael Rodriguez",
            participants: [user.id, "user456"],
            isGroup: false,
            lastMessage: "I loved your performance in that short film!",
            lastMessageTime: "Yesterday",
            unread: 0,
            avatar: "/placeholder.svg",
            role: "Director",
            online: false
          },
          {
            id: "3",
            name: "Emma Thompson",
            participants: [user.id, "user789"],
            isGroup: false,
            lastMessage: "Let's discuss the contract details",
            lastMessageTime: "Monday",
            unread: 0,
            avatar: "/placeholder.svg",
            role: "Producer",
            online: true
          },
          {
            id: "4",
            name: "Film Project Team",
            participants: [user.id, "user123", "user456", "user789"],
            isGroup: true,
            lastMessage: "Hey team, I've uploaded the latest schedule",
            lastMessageTime: "08/10/2023",
            unread: 3,
            avatar: "/placeholder.svg"
          }
        ];
        
        setChats(dummyChats);
      } catch (error) {
        console.error('Error loading chats:', error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChats();
    
    return () => {
    };
  }, [user]);
  
  useEffect(() => {
    if (!user || !chatId) return;
    console.log('[useChat] Listening for messages in chat_rooms/' + chatId + '/messages');
    // Listen for messages in Firestore for this chat room (subcollection)
    const q = query(
      collection(db, 'chat_rooms', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          recipientId: data.recipientId,
          chatId: chatId,
          content: data.content,
          timestamp: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          status: (data.status as 'sent' | 'delivered' | 'seen') || 'sent',
          isMe: data.senderId === user.id,
          attachments: Array.isArray(data.attachments) ? data.attachments : undefined,
          isEdited: data.isEdited || false,
          isDeleted: data.isDeleted || false,
        };
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [user, chatId]);
  
  useEffect(() => {
    if (!user || !chatId) return;
    const typingRef = collection(db, 'chat_rooms', chatId, 'typing');
    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      const typing = snapshot.docs
        .filter(doc => doc.id !== user.id && doc.data().isTyping)
        .map(doc => doc.id);
      setTypingUsers(typing);
    });
    return () => unsubscribe();
  }, [user, chatId]);
  
  useEffect(() => {
    let filtered = [...chats];
    
    if (searchQuery) {
      filtered = filtered.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (showUnreadOnly) {
      filtered = filtered.filter(chat => chat.unread > 0);
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return a.lastMessageTime < b.lastMessageTime ? 1 : -1;
        case 'oldest':
          return a.lastMessageTime > b.lastMessageTime ? 1 : -1;
        case 'active':
          return b.unread - a.unread;
        default:
          return 0;
      }
    });
    
    setFilteredChats(filtered);
  }, [chats, searchQuery, showUnreadOnly, sortBy]);
  
  const sendMessage = async (content: string, attachments?: File[], replyToMessageId?: string) => {
    if (!user || !chatId) return false;
    try {
      const recipientId = participants.find((id) => id !== user.id);
      // Generate a message id for attachments
      const newMessageId = Math.random().toString(36).substring(7);
      let attachmentData: Attachment[] | undefined = undefined;
      if (attachments && attachments.length > 0) {
        // For demo: just use local URLs. In production, upload to storage and use download URLs.
        attachmentData = await Promise.all(attachments.map(async (file) => ({
          id: Math.random().toString(36).substring(7),
          messageId: newMessageId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: URL.createObjectURL(file),
        })));
      }
      let messageData: any = {
        id: newMessageId,
        senderId: user.id,
        recipientId: recipientId,
        chatId: chatId,
        content,
        createdAt: serverTimestamp(),
        status: 'sent',
        isMe: true,
        isEdited: false,
        isDeleted: false,
        readBy: [user.id],
      };
      if (Array.isArray(attachmentData) && attachmentData.length > 0) {
        messageData.attachments = attachmentData;
      }
      console.log('[useChat] Sending message to:', `chat_rooms/${chatId}/messages`, messageData, 'participants:', participants);
      await addDoc(collection(db, 'chat_rooms', chatId, 'messages'), messageData);
      // Update chat room preview (last message)
      const chatRoomRef = doc(db, 'chat_rooms', chatId);
      await updateDoc(chatRoomRef, {
        'metadata.last_message': content,
        last_message_at: new Date().toISOString(),
      });
      await stopTyping();
      return true;
    } catch (error) {
      console.error('Error sending message:', error, 'chatId:', chatId, 'participants:', participants);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const updateChatPreview = (chatId: string, lastMessage: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId
          ? { 
              ...chat, 
              lastMessage, 
              lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : chat
      )
    );
  };
  
  const markChatAsRead = (chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId
          ? { ...chat, unread: 0 }
          : chat
      )
    );
    
    setMessages(prevMessages => 
      prevMessages.map(message => 
        !message.isMe && message.status !== 'seen'
          ? { ...message, status: 'seen' as const }
          : message
      )
    );
  };
  
  const indicateTyping = (chatId: string) => {
    if (!user) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setUserTyping(null);
    }, 3000);
  };
  
  const editMessage = async (messageId: string, newContent: string) => {
    try {
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId
            ? { ...message, content: newContent, isEdited: true }
            : message
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error editing message:', error);
      toast({
        title: "Error",
        description: "Failed to edit message",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const deleteMessage = async (messageId: string, forEveryone: boolean = false) => {
    try {
      if (forEveryone) {
        setMessages(prev => 
          prev.map(message => 
            message.id === messageId
              ? { ...message, content: "This message was deleted", isDeleted: true, attachments: undefined, reactions: undefined }
              : message
          )
        );
      } else {
        setMessages(prev => prev.filter(message => message.id !== messageId));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return false;
    
    try {
      const reaction = { userId: user.id, emoji };
      
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId
            ? { 
                ...message, 
                reactions: message.reactions 
                  ? [...message.reactions.filter(r => r.userId !== user.id), reaction] 
                  : [reaction] 
              }
            : message
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const createGroupChat = async (name: string, participantIds: string[]) => {
    if (!user) return false;
    
    try {
      const allParticipants = [user.id, ...participantIds];
      
      const newChat: Chat = {
        id: `group-${Date.now()}`,
        name,
        participants: allParticipants,
        isGroup: true,
        lastMessage: "Group created",
        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 0,
        avatar: "/placeholder.svg"
      };
      
      setChats(prev => [newChat, ...prev]);
      
      return true;
    } catch (error) {
      console.error('Error creating group chat:', error);
      toast({
        title: "Error",
        description: "Failed to create group chat",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const uploadAttachment = async (file: File) => {
    try {
      return {
        success: true,
        url: URL.createObjectURL(file),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      };
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
      return { success: false };
    }
  };
  
  const startTyping = async () => {
    if (!user || !chatId) return;
    await setDoc(doc(db, 'chat_rooms', chatId, 'typing', user.id), { isTyping: true });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(stopTyping, 3000);
  };
  
  const stopTyping = async () => {
    if (!user || !chatId) return;
    await setDoc(doc(db, 'chat_rooms', chatId, 'typing', user.id), { isTyping: false });
  };
  
  const markAllMessagesAsRead = async () => {
    if (!user || !chatId) return;
    const q = query(
      collection(db, 'chat_rooms', chatId, 'messages')
    );
    const snapshot = await getDocs(q);
    snapshot.docs.forEach(async (msgDoc) => {
      const data = msgDoc.data();
      if (!data.readBy || !data.readBy.includes(user.id)) {
        await updateDoc(msgDoc.ref, { readBy: [...(data.readBy || []), user.id] });
      }
    });
  };
  
  return {
    chats: filteredChats,
    messages,
    isLoading,
    userTyping,
    searchQuery,
    showUnreadOnly,
    sortBy,
    setSearchQuery,
    setShowUnreadOnly,
    setSortBy,
    sendMessage,
    markChatAsRead,
    indicateTyping,
    editMessage,
    deleteMessage,
    addReaction,
    createGroupChat,
    uploadAttachment,
    typingUsers,
    startTyping,
    stopTyping,
    markAllMessagesAsRead
  };
};
