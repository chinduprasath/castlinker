
import { db } from '@/integrations/firebase/client';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'account' | 'feature-request' | 'bug' | 'other';
  created_at: string;
  updated_at: string;
  user_id: string;
  assigned_to?: string;
  resolution?: string;
}

export const fetchTickets = async (userId?: string): Promise<Ticket[]> => {
  try {
    // Mock data for testing
    return [
      {
        id: '1',
        title: 'Unable to upload portfolio images',
        description: 'I\'m getting an error when trying to upload images to my portfolio section.',
        status: 'open',
        priority: 'high',
        category: 'technical',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        user_id: 'user123'
      },
      {
        id: '2',
        title: 'Billing question about subscription',
        description: 'I was charged twice for my monthly subscription. Can you help me with this?',
        status: 'in-progress',
        priority: 'medium',
        category: 'billing',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        user_id: 'user123',
        assigned_to: 'support_agent_1'
      },
      {
        id: '3',
        title: 'Feature request: Advanced search filters',
        description: 'It would be great if we could filter jobs by salary range and experience level.',
        status: 'resolved',
        priority: 'low',
        category: 'feature-request',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        user_id: 'user123',
        resolution: 'This feature has been added to our development roadmap and will be available in the next update.'
      }
    ];
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
};

export const createTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const ticketsRef = collection(db, 'tickets');
    const docRef = await addDoc(ticketsRef, {
      ...ticketData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

export const updateTicket = async (ticketId: string, ticketData: Partial<Ticket>): Promise<void> => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, {
      ...ticketData,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
};
