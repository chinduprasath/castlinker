
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage,
  Conversation,
  Message
} from '@/services/messagesService';

export const useMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const conversationsData = await fetchConversations(user.id);
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const messagesData = await fetchMessages(conversationId);
      setMessages(messagesData);
      setSelectedConversation(conversationId);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (content: string, recipientId: string) => {
    if (!user || !selectedConversation) return;

    try {
      await sendMessage({
        sender_id: user.id,
        sender_name: user.name || 'User',
        recipient_id: recipientId,
        content,
        conversation_id: selectedConversation
      });
      
      // Reload messages to show the new one
      await loadMessages(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  return {
    conversations,
    messages,
    selectedConversation,
    isLoading,
    selectConversation: loadMessages,
    sendMessage: handleSendMessage,
    refetch: loadConversations
  };
};
