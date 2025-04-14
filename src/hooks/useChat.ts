
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { E2EEncryption } from '../utils/encryption';
import {
    Message,
    ChatRoom,
    UserPresence,
    MediaAttachment,
} from '../types/chat';

export const useChat = (roomId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();
    const encryption = new E2EEncryption();

    // Load room information
    useEffect(() => {
        const loadRoomInfo = async () => {
            const { data, error } = await supabase
                .from('chat_rooms')
                .select('*, chat_room_members(*)')
                .eq('id', roomId)
                .single();

            if (data) {
                setRoomInfo(data);
            }
        };

        loadRoomInfo();
    }, [roomId]);

    // Load initial messages
    useEffect(() => {
        const loadMessages = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    media_attachments(*),
                    message_reactions(*)
                `)
                .eq('room_id', roomId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (data) {
                // Decrypt messages
                const decryptedMessages = await Promise.all(
                    data.map(async (message) => {
                        const decrypted = await encryption.decryptMessage(
                            message.content_encrypted,
                            message.iv,
                            message.sender_public_key,
                            user!.private_key
                        );
                        return { ...message, content: decrypted };
                    })
                );
                setMessages(decryptedMessages.reverse());
            }
            setIsLoading(false);
        };

        if (roomId && user) {
            loadMessages();
        }
    }, [roomId, user]);

    // Subscribe to new messages
    useEffect(() => {
        const subscription = supabase
            .channel(`room:${roomId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${roomId}`
            }, async (payload) => {
                if (payload.eventType === 'INSERT') {
                    const newMessage = payload.new as Message;
                    const decrypted = await encryption.decryptMessage(
                        newMessage.content_encrypted,
                        newMessage.iv,
                        newMessage.sender_public_key,
                        user!.private_key
                    );
                    setMessages((prev) => [...prev, { ...newMessage, content: decrypted }]);
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [roomId, user]);

    // Handle presence and typing indicators
    useEffect(() => {
        const channel = supabase.channel(`presence:${roomId}`);

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const online = Object.values(state).flat() as UserPresence[];
                setOnlineUsers(online);
            })
            .on('presence', { event: 'join' }, ({ key, newPresence }) => {
                setOnlineUsers((prev) => [...prev, ...newPresence]);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresence }) => {
                setOnlineUsers((prev) =>
                    prev.filter((u) => !leftPresence.some((p) => p.user_id === u.user_id))
                );
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user_id: user!.id,
                        status: 'online',
                        last_active: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [roomId, user]);

    // Send message function
    const sendMessage = async (content: string, attachments: File[] = []) => {
        if (!user || !content.trim()) return;

        // Upload attachments first
        const mediaAttachments: MediaAttachment[] = [];
        if (attachments.length > 0) {
            for (const file of attachments) {
                const { fileKey, encryptedFile } = await encryption.encryptFile(file);
                const { data, error } = await supabase.storage
                    .from('chat-attachments')
                    .upload(`${roomId}/${file.name}`, encryptedFile);

                if (data) {
                    mediaAttachments.push({
                        type: file.type.split('/')[0] as "image" | "audio" | "video" | "document",
                        url: data.path,
                        filename: file.name,
                        size_bytes: file.size,
                        mime_type: file.type,
                        encrypted_key: fileKey,
                    });
                }
            }
        }

        // Get room members for encryption
        const { data: members } = await supabase
            .from('chat_room_members')
            .select('user_id, public_key')
            .eq('room_id', roomId);

        // Encrypt message for each recipient
        const encryptedMessages = await Promise.all(
            members!.map(async (member) => {
                const { encrypted, iv } = await encryption.encryptMessage(
                    content,
                    user.private_key,
                    member.public_key
                );
                return { user_id: member.user_id, encrypted, iv };
            })
        );

        // Send message
        const { data, error } = await supabase.from('messages').insert({
            room_id: roomId,
            sender_id: user.id,
            content_encrypted: JSON.stringify(encryptedMessages),
            type: attachments.length > 0 ? 'media' : 'text',
            metadata: {
                attachments: mediaAttachments,
            },
        });

        if (error) {
            console.error('Error sending message:', error);
        }
    };

    // Load more messages
    const loadMoreMessages = async () => {
        if (!hasMoreMessages || isLoading) return;

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('room_id', roomId)
            .order('created_at', { ascending: false })
            .lt('created_at', messages[0].created_at)
            .limit(50);

        if (data) {
            const decryptedMessages = await Promise.all(
                data.map(async (message) => {
                    const decrypted = await encryption.decryptMessage(
                        message.content_encrypted,
                        message.iv,
                        message.sender_public_key,
                        user!.private_key
                    );
                    return { ...message, content: decrypted };
                })
            );
            setMessages((prev) => [...decryptedMessages.reverse(), ...prev]);
            setHasMoreMessages(data.length === 50);
        }
    };

    // Handle typing indicator
    const setTyping = async (isTyping: boolean) => {
        if (!user) return;

        const channel = supabase.channel(`presence:${roomId}`);
        await channel.track({
            user_id: user.id,
            typing_in_room: isTyping ? roomId : null,
            typing_until: isTyping ? new Date(Date.now() + 3000).toISOString() : null,
        });
    };

    // Delete message
    const deleteMessage = async (messageId: string, forEveryone: boolean) => {
        if (!user) return;

        if (forEveryone) {
            await supabase
                .from('messages')
                .update({ is_deleted: true })
                .eq('id', messageId)
                .eq('sender_id', user.id);
        } else {
            // Implement local message hiding
        }
    };

    // Edit message
    const editMessage = async (messageId: string, newContent: string) => {
        if (!user || !newContent.trim()) return;

        const { data: message } = await supabase
            .from('messages')
            .select('*')
            .eq('id', messageId)
            .single();

        if (message && message.sender_id === user.id) {
            // Re-encrypt message for all recipients
            const { data: members } = await supabase
                .from('chat_room_members')
                .select('user_id, public_key')
                .eq('room_id', roomId);

            const encryptedMessages = await Promise.all(
                members!.map(async (member) => {
                    const { encrypted, iv } = await encryption.encryptMessage(
                        newContent,
                        user.private_key,
                        member.public_key
                    );
                    return { user_id: member.user_id, encrypted, iv };
                })
            );

            await supabase
                .from('messages')
                .update({
                    content_encrypted: JSON.stringify(encryptedMessages),
                    is_edited: true,
                })
                .eq('id', messageId);
        }
    };

    // Add reaction
    const addReaction = async (messageId: string, emoji: string) => {
        if (!user) return;

        await supabase.from('message_reactions').upsert({
            message_id: messageId,
            user_id: user.id,
            emoji,
        });
    };

    // Remove reaction
    const removeReaction = async (messageId: string, emoji: string) => {
        if (!user) return;

        await supabase
            .from('message_reactions')
            .delete()
            .eq('message_id', messageId)
            .eq('user_id', user.id)
            .eq('emoji', emoji);
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
        deleteMessage,
        editMessage,
        addReaction,
        removeReaction,
        isLoading,
    };
};
