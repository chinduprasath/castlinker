
export interface Event {
  id: string;
  title: string;
  description?: string;
  location: string;
  event_date: string;
  event_time: string;
  status: 'upcoming' | 'completed' | 'registration' | 'cancelled';
  attendees: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  status: 'upcoming' | 'completed' | 'registration' | 'cancelled';
  attendees: number;
}
