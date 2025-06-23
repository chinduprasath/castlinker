
export type EventType = 'workshop' | 'webinar' | 'festival' | 'networking' | 'screening' | 'conference';

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
  event_type?: EventType;
  start_date?: string;
  end_date?: string;
  organizer?: string;
  image_url?: string;
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
