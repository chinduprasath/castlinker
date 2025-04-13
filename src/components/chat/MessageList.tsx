import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { Message } from '../../types/chat';
import { EmojiPicker } from './EmojiPicker';

interface MessageListProps {
    messages: Message[];
    onDelete: (messageId: string, forEveryone: boolean) => Promise<void>;
    onEdit: (messageId: string, newContent: string) => Promise<void>;
    onReaction: (messageId: string, emoji: string) => Promise<void>;
    onRemoveReaction: (messageId: string, emoji: string) => Promise<void>;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    onDelete,
    onEdit,
    onReaction,
    onRemoveReaction,
}) => {
    const { user } = useAuth();
    const [editingMessageId, setEditingMessageId] = React.useState<string | null>(null);
    const [editContent, setEditContent] = React.useState('');

    const handleEditStart = (message: Message) => {
        setEditingMessageId(message.id);
        setEditContent(message.content);
    };

    const handleEditSave = async () => {
        if (editingMessageId && editContent.trim()) {
            await onEdit(editingMessageId, editContent);
            setEditingMessageId(null);
            setEditContent('');
        }
    };

    const handleEditCancel = () => {
        setEditingMessageId(null);
        setEditContent('');
    };

    const renderMessageContent = (message: Message) => {
        if (message.is_deleted) {
            return (
                <span className="italic text-gray-400">
                    This message was deleted
                </span>
            );
        }

        if (editingMessageId === message.id) {
            return (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                        autoFocus
                    />
                    <button
                        onClick={handleEditSave}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleEditCancel}
                        className="text-sm text-gray-600 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            );
        }

        switch (message.type) {
            case 'text':
                return <p className="whitespace-pre-wrap">{message.content}</p>;
            case 'image':
                return (
                    <img
                        src={message.content}
                        alt="Image message"
                        className="max-w-sm rounded-lg"
                    />
                );
            case 'video':
                return (
                    <video
                        controls
                        className="max-w-sm rounded-lg"
                    >
                        <source src={message.content} />
                    </video>
                );
            case 'audio':
                return (
                    <audio controls className="max-w-sm">
                        <source src={message.content} />
                    </audio>
                );
            case 'document':
                return (
                    <a
                        href={message.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                        {message.metadata.fileName}
                    </a>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${
                        message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                >
                    <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender_id === user?.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                        }`}
                    >
                        {renderMessageContent(message)}
                        <div className="flex items-center justify-between mt-1 text-xs">
                            <span className={message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}>
                                {format(new Date(message.created_at), 'h:mm a')}
                            </span>
                            {message.is_edited && (
                                <span className={message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}>
                                    (edited)
                                </span>
                            )}
                        </div>
                        {message.reactions && message.reactions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {message.reactions.map((reaction) => (
                                    <span
                                        key={`${reaction.emoji}-${reaction.user_id}`}
                                        className="px-2 py-1 text-xs bg-white rounded-full shadow-sm"
                                        onClick={() => onRemoveReaction(message.id, reaction.emoji)}
                                    >
                                        {reaction.emoji} {reaction.count}
                                    </span>
                                ))}
                            </div>
                        )}
                        {message.sender_id === user?.id && !message.is_deleted && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEditStart(message)}
                                    className="p-1 text-gray-600 hover:text-gray-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(message.id, true)}
                                    className="p-1 text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                        <EmojiPicker
                            onSelect={(emoji) => onReaction(message.id, emoji)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}; 