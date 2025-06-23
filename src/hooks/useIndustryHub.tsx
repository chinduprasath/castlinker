
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/integrations/firebase/client';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author_name: string;
  author_avatar: string;
  read_time: string;
  is_featured?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  image: string;
  is_featured?: boolean;
}

export interface CourseItem {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  reviews: number;
  lessons: number;
  hours: number;
  level: string;
  image: string;
  is_featured?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: string;
  downloads: number;
  image: string;
  file_url?: string;
  is_featured?: boolean;
}

export const useIndustryHub = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('news');
  const { user } = useAuth();

  useEffect(() => {
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch news
      const newsData: NewsItem[] = [
        {
          id: '1',
          title: 'The Future of Independent Film Distribution',
          excerpt: 'Exploring how streaming platforms are changing the landscape for independent filmmakers.',
          image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000',
          category: 'Industry Analysis',
          author_name: 'Sarah Chen',
          author_avatar: '/placeholder.svg',
          read_time: '8 min read',
          is_featured: true
        }
      ];
      setNews(newsData);

      // Fetch events
      const eventsData: EventItem[] = [
        {
          id: '1',
          title: 'Virtual Film Festival 2024',
          description: 'Join us for the annual virtual film festival showcasing independent films.',
          date: '2024-03-15',
          time: '6:00 PM PST',
          location: 'Online',
          type: 'Festival',
          image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000',
          is_featured: true
        }
      ];
      setEvents(eventsData);

      // Fetch courses
      const coursesData: CourseItem[] = [
        {
          id: '1',
          title: 'Cinematography Masterclass',
          instructor: 'Roger Deakins',
          rating: 4.9,
          reviews: 324,
          lessons: 36,
          hours: 14.5,
          level: 'Advanced',
          image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1000',
          is_featured: true
        }
      ];
      setCourses(coursesData);

      // Fetch resources
      const resourcesData: ResourceItem[] = [
        {
          id: '1',
          title: 'Film Production Checklist',
          type: 'Template',
          downloads: 1250,
          image: 'https://images.unsplash.com/photo-1581557991964-125469da3b8a?q=80&w=1000'
        }
      ];
      setResources(resourcesData);

    } catch (error) {
      console.error('Error fetching industry hub data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitContent = async ({ type, data }: { type: string; data: any }) => {
    // Implementation for submitting content
    console.log('Submitting content:', type, data);
    return Promise.resolve();
  };

  const refreshData = () => {
    fetchAllData();
  };

  return {
    news,
    events,
    courses,
    resources,
    isLoading,
    searchQuery,
    activeTab,
    setSearchQuery,
    setActiveTab,
    submitContent,
    refreshData
  };
};

export default useIndustryHub;
