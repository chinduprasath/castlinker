import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { E2EEncryption } from '@/utils/encryption';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  content_encrypted: string;
  iv: string;
  sender_public_key: string;
  created_at: string;
  message_type: string;
  file_url?: string;
}

interface UseChatProps {
  roomId: string;
}

export const useChat = ({ roomId }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          // Decrypt messages
          const decryptedMessages = data.map(message => {
            if (message.message_type === 'text' && message.content_encrypted && message.iv && message.sender_public_key) {
              const decryptedMessage = E2EEncryption.decryptMessage(
                {
                  content_encrypted: message.content_encrypted,
                  iv: message.iv,
                  sender_public_key: message.sender_public_key
                },
                user?.private_key || ''
              );

              return {
                ...message,
                content: decryptedMessage || 'Failed to decrypt message'
              };
            }
            return message;
          });

          setMessages(decryptedMessages as Message[]);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, async (payload) => {
        if (payload.new) {
          const newMessage = payload.new as Message;

          // Decrypt the new message
          if (newMessage.message_type === 'text' && newMessage.content_encrypted && newMessage.iv && newMessage.sender_public_key) {
            const decryptedContent = E2EEncryption.decryptMessage(
              {
                content_encrypted: newMessage.content_encrypted,
                iv: newMessage.iv,
                sender_public_key: newMessage.sender_public_key
              },
              user?.private_key || ''
            );

            newMessage.content = decryptedContent || 'Failed to decrypt message';
          }

          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, user, toast]);

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string, message_type: string = 'text') => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages.",
        variant: "destructive"
      });
      return;
    }

    try {
      let content_encrypted = null;
      let iv = null;
      let file_url = null;

      if (message_type === 'text') {
        // Encrypt the message content
        const { encrypted: encryptedContent, nonce } = E2EEncryption.encryptMessage(
          content,
          user?.private_key || '',
          user?.user_metadata.publicKey
        );

        if (encryptedContent && nonce) {
          content_encrypted = encryptedContent;
          iv = nonce;
        }
      } else if (message_type === 'file' && fileUrl) {
        // For file messages, store the file URL
        file_url = fileUrl;
      }

      const newMessage: Message = {
        id: uuidv4(),
        room_id: roomId,
        sender_id: user.id,
        content: content,
        content_encrypted: content_encrypted,
        iv: iv,
        sender_public_key: user.user_metadata.publicKey,
        created_at: new Date().toISOString(),
        message_type: message_type,
        file_url: file_url
      };

      const { error } = await supabase
        .from('messages')
        .insert(newMessage as any);

      if (error) {
        throw error;
      }

      // Optimistically update the local state
      setMessages(prevMessages => [...prevMessages, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setFileUrl(null); // Reset file URL after sending
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      // Encrypt the file
      const { encrypted: encryptedFile, nonce } = await E2EEncryption.encryptFile(
        file,
        user?.private_key || '',
        user?.user_metadata.publicKey
      );

      // Upload the encrypted file to Supabase storage
      const filePath = `chat-files/${uuidv4()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get the public URL of the uploaded file
      const { data: fileData } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath);

      if (fileData) {
        setFileUrl(fileData.publicUrl);

        // Send the message with the file URL
        await sendMessage(fileData.publicUrl, 'file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const decryptFile = async (message: Message) => {
    try {
      // Fetch the encrypted file from Supabase storage
      const { data, error } = await supabase.storage
        .from('chat-files')
        .download(message.file_url.split('/').pop());

      if (error) {
        throw error;
      }

      // Decrypt the file
      const decryptedContent = E2EEncryption.decryptMessage(
        {
          content_encrypted: message.content_encrypted,
          iv: message.iv,
          sender_public_key: message.sender_public_key
        },
        user?.private_key || ''
      );

      // Create a blob from the decrypted data
      const blob = new Blob([new Uint8Array(decryptedContent)], { type: message.file_type });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Open the file in a new tab
      window.open(url);
    } catch (error) {
      console.error('Error decrypting file:', error);
      toast({
        title: "Error",
        description: "Failed to decrypt file",
        variant: "destructive"
      });
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    uploadFile,
    uploading,
    bottomRef,
    decryptFile
  };
};
