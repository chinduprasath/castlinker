
import { useState, useEffect } from 'react';
import { Event, EventType } from '@/types/eventTypes';

export const useEventsData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Mock data that matches the Event interface
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Film Festival 2024',
            description: 'Annual film festival showcasing independent films',
            location: 'Los Angeles, CA',
            event_date: '2024-03-15',
            event_time: '18:00',
            status: 'upcoming',
            attendees: 250,
            event_type: 'festival',
            organizer: 'Film Society',
            image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return {
    events,
    isLoading,
    refetch: () => {
      setIsLoading(true);
      // Refetch logic here
      setIsLoading(false);
    }
  };
};
