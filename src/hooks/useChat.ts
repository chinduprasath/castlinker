import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/integrations/firebase/client';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  displayName: string;
  photoURL: string;
}

const useChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
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
          text: data.text,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          userId: data.userId,
          displayName: data.displayName,
          photoURL: data.photoURL,
        };
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async (text: string) => {
    if (!user || !roomId) return;

    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    await addDoc(messagesRef, {
      text,
      createdAt: serverTimestamp(),
      userId: user.id,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  };

  return { messages, sendMessage };
};

export default useChat;
