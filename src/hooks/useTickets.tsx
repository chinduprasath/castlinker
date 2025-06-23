
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchTickets, 
  createTicket, 
  updateTicket,
  Ticket
} from '@/services/ticketsService';

export const useTickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const ticketsData = await fetchTickets(user?.id);
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tickets',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (ticketData: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createTicket(ticketData);
      await loadTickets();
      toast({
        title: 'Success',
        description: 'Ticket created successfully'
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to create ticket',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateTicket = async (ticketId: string, ticketData: Partial<Ticket>) => {
    try {
      await updateTicket(ticketId, ticketData);
      await loadTickets();
      toast({
        title: 'Success',
        description: 'Ticket updated successfully'
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to update ticket',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  return {
    tickets,
    isLoading,
    createTicket: handleCreateTicket,
    updateTicket: handleUpdateTicket,
    refetch: loadTickets
  };
};
