import React, { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
}

const commonEmojis = ['👍', '❤️', '😊', '😂', '🎉', '👏', '🔥', '💯'];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
    const [showFullPicker, setShowFullPicker] = useState(false);

    return (
        <div className="relative">
            {!showFullPicker ? (
                <div className="flex gap-1 p-2 bg-white rounded-lg shadow-lg">
                    {commonEmojis.map((emoji) => (
                        <button
                            key={emoji}
                            onClick={() => onSelect(emoji)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            {emoji}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowFullPicker(true)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                    >
                        •••
                    </button>
                </div>
            ) : (
                <div className="absolute bottom-0 right-0">
                    <Picker
                        data={data}
                        onEmojiSelect={(emoji: any) => {
                            onSelect(emoji.native);
                            setShowFullPicker(false);
                        }}
                        theme="light"
                        set="native"
                        showPreview={false}
                        showSkinTones={false}
                        emojiSize={20}
                        emojiButtonSize={28}
                        maxFrequentRows={0}
                    />
                </div>
            )}
        </div>
    );
}; 