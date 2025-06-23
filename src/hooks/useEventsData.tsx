import { useState, useEffect } from 'react';
import { Event, EventType } from '@/types/eventTypes';
import { db } from '@/integrations/firebase/client';
import { collection, getDocs } from 'firebase/firestore';

const useEventsData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        
        const eventsList: Event[] = eventsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            location: data.location,
            event_type: data.event_type as EventType,
            start_date: data.start_date,
            end_date: data.end_date,
            organizer: data.organizer,
            created_at: data.created_at,
            updated_at: data.updated_at,
            image_url: data.image_url
          };
        });

        setEvents(eventsList);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events');
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return {
    events,
    isLoading,
    error,
  };
};

export default useEventsData;
