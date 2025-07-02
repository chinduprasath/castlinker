import { db } from '@/integrations/firebase/client';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

export const sendProjectMessage = async (projectId, message) => {
  const chatRef = collection(db, 'projects', projectId, 'chat');
  await addDoc(chatRef, {
    ...message,
    createdAt: serverTimestamp(),
  });
};

export const subscribeToProjectChat = (projectId, callback) => {
  const chatRef = collection(db, 'projects', projectId, 'chat');
  const q = query(chatRef, orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
}; 