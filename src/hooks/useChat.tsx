import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  attachments?: Attachment[];
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

export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'active'>('newest');
  const [userTyping, setUserTyping] = useState<{userId: string, chatId: string} | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
        if (dummyChats.length > 0) {
          setActiveChat(dummyChats[0]);
        }
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
    setupRealtimeSubscription();
    
    return () => {
      cleanupRealtimeSubscription();
    };
  }, [user]);
  
  useEffect(() => {
    if (!activeChat) return;
    
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        if (activeChat.id === "1") {
          const dummyMessages = [
            {
              id: "m1",
              senderId: "user123",
              recipientId: user?.id,
              chatId: "1",
              content: "Hi James, I saw your profile and I'm impressed with your work!",
              timestamp: "10:15 AM",
              status: 'seen' as const,
              isMe: false,
              isEdited: false,
              isDeleted: false
            },
            {
              id: "m2",
              senderId: user?.id || "",
              recipientId: "user123",
              chatId: "1",
              content: "Thank you, Sarah! I'm glad you liked my portfolio.",
              timestamp: "10:17 AM",
              status: 'seen' as const,
              isMe: true,
              isEdited: false,
              isDeleted: false
            },
            {
              id: "m3",
              senderId: "user123",
              recipientId: user?.id,
              chatId: "1",
              content: "I'm working on a new indie film and I think you'd be perfect for one of the roles.",
              timestamp: "10:20 AM",
              status: 'seen' as const,
              isMe: false,
              isEdited: false,
              isDeleted: false
            },
            {
              id: "m4",
              senderId: user?.id || "",
              recipientId: "user123",
              chatId: "1",
              content: "That sounds interesting! I'd love to hear more about it.",
              timestamp: "10:22 AM",
              status: 'seen' as const,
              isMe: true,
              isEdited: false,
              isDeleted: false
            },
            {
              id: "m5",
              senderId: "user123",
              recipientId: user?.id,
              chatId: "1",
              content: "Great! It's a drama set in the 1960s. The character I'm thinking of is a struggling musician with a complicated past.",
              timestamp: "10:25 AM",
              status: 'seen' as const,
              isMe: false,
              isEdited: false,
              isDeleted: false
            },
            {
              id: "m6",
              senderId: "user123",
              recipientId: user?.id,
              chatId: "1",
              content: "Would you be able to send me an audition tape with a few scenes? I can send over the script excerpts.",
              timestamp: "10:26 AM",
              status: 'seen' as const,
              isMe: false,
              isEdited: false,
              isDeleted: false
            },
            {
              id: "m7",
              senderId: user?.id || "",
              recipientId: "user123",
              chatId: "1",
              content: "That sounds like a challenging role, I'm definitely interested! Yes, I can prepare an audition tape once I receive the script.",
              timestamp: "10:28 AM",
              status: 'seen' as const,
              isMe: true,
              isEdited: false,
              isDeleted: false
            },
            {
              id: "m8",
              senderId: "user123",
              recipientId: user?.id,
              chatId: "1",
              content: "When can you send the audition tape?",
              timestamp: "10:30 AM",
              status: 'delivered' as const,
              isMe: false,
              isEdited: false,
              isDeleted: false
            }
          ];
          setMessages(dummyMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    markChatAsRead(activeChat.id);
  }, [activeChat, user]);
  
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
    if (!user || !activeChat) return false;
    
    try {
      const newMessage = {
        id: `m${messages.length + 1}`,
        senderId: user.id,
        recipientId: activeChat.isGroup ? null : activeChat.participants.find(id => id !== user.id),
        chatId: activeChat.id,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent' as const,
        isMe: true,
        attachments: attachments ? attachments.map(file => ({
          id: Math.random().toString(36).substring(7),
          messageId: `m${messages.length + 1}`,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: URL.createObjectURL(file),
        })) : undefined,
        isEdited: false,
        isDeleted: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      updateChatPreview(activeChat.id, content);
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
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
  
  const setupRealtimeSubscription = () => {
    if (!user) return;
    
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          const newMessage = payload.new;
          // Handle new message
        }
      )
      .subscribe();
  };
  
  const cleanupRealtimeSubscription = () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
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
      setActiveChat(newChat);
      
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
  
  return {
    chats: filteredChats,
    activeChat,
    messages,
    isLoading,
    userTyping,
    searchQuery,
    showUnreadOnly,
    sortBy,
    setActiveChat,
    sendMessage,
    markChatAsRead,
    indicateTyping,
    setSearchQuery,
    setShowUnreadOnly,
    setSortBy,
    editMessage,
    deleteMessage,
    addReaction,
    createGroupChat,
    uploadAttachment
  };
};
