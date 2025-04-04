
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  industryNews,
  industryEvents,
  industryCourses,
  industryResources
} from '@/utils/dummyData';

// Type definitions
export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author_name: string;
  author_avatar: string;
  category: string;
  read_time: string;
  image: string;
  is_featured?: boolean;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  image: string;
  is_featured?: boolean;
};

export type CourseItem = {
  id: string;
  title: string;
  instructor: string;
  lessons: number;
  hours: number;
  level: string;
  rating: number;
  reviews: number;
  image: string;
  is_featured?: boolean;
};

export type ResourceItem = {
  id: string;
  title: string;
  type: string;
  downloads: number;
  image: string;
  file_url: string;
};

export type IndustrySubmission = {
  type: 'news' | 'event' | 'course' | 'resource';
  data: any;
};

export const useIndustryHub = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('news');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch all industry data
  const fetchIndustryData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Use dummy data directly
      setNews(industryNews);
      setEvents(industryEvents);
      setCourses(industryCourses);
      setResources(industryResources);
      
      // In a real implementation, we would fetch from Supabase
      // Example of how this would work with a real database:
      /*
      const { data: newsData, error: newsError } = await supabase
        .from('industry_news')
        .select('*')
        .order('date', { ascending: false });
        
      if (newsError) throw newsError;
      setNews(newsData);
      
      // Similar implementations for other data types
      */
      
    } catch (error) {
      console.error('Error fetching industry data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load industry data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchIndustryData();
  }, [fetchIndustryData]);

  // Filter news based on search query
  const filteredNews = searchQuery
    ? news.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : news;

  // Filter events based on search query
  const filteredEvents = searchQuery
    ? events.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  // Filter courses based on search query
  const filteredCourses = searchQuery
    ? courses.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.level.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : courses;

  // Filter resources based on search query
  const filteredResources = searchQuery
    ? resources.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : resources;

  // Submit new content
  const submitContent = async (submission: IndustrySubmission) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to submit content',
        variant: 'destructive',
      });
      return { success: false };
    }

    try {
      const { type, data } = submission;

      // In a real implementation, we would insert into Supabase
      // For now, we'll simulate success and update the local state
      
      switch (type) {
        case 'news':
          const newNewsItem: NewsItem = {
            id: `temp-${Date.now()}`,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            date: new Date().toISOString(),
            author_name: user.name || 'Anonymous',
            author_avatar: user.avatar || '/placeholder.svg',
            category: data.category,
            read_time: `${Math.ceil(data.content.length / 1000)} min`,
            image: data.image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000',
            is_featured: false
          };
          
          setNews(prev => [newNewsItem, ...prev]);
          break;
          
        case 'event':
          const newEventItem: EventItem = {
            id: `temp-${Date.now()}`,
            title: data.title,
            description: data.description,
            date: data.date,
            time: data.time,
            location: data.location,
            type: data.type,
            image: data.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000',
            is_featured: false
          };
          
          setEvents(prev => [newEventItem, ...prev]);
          break;
          
        case 'course':
          const newCourseItem: CourseItem = {
            id: `temp-${Date.now()}`,
            title: data.title,
            instructor: data.instructor,
            lessons: parseInt(data.lessons) || 0,
            hours: parseFloat(data.hours) || 0,
            level: data.level,
            rating: 0,
            reviews: 0,
            image: data.image || 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1000',
            is_featured: false
          };
          
          setCourses(prev => [newCourseItem, ...prev]);
          break;
          
        case 'resource':
          const newResourceItem: ResourceItem = {
            id: `temp-${Date.now()}`,
            title: data.title,
            type: data.type,
            downloads: 0,
            image: data.image || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000',
            file_url: data.file_url || '/placeholder.svg'
          };
          
          setResources(prev => [newResourceItem, ...prev]);
          break;
      }

      toast({
        title: 'Submission Successful',
        description: 'Your content has been submitted successfully',
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting content:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your content',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  // Download a resource
  const downloadResource = async (resourceId: string) => {
    try {
      // In a real implementation, we would update download count in Supabase
      // For now, we'll simulate success and update the local state
      
      setResources(prev =>
        prev.map(resource =>
          resource.id === resourceId
            ? { ...resource, downloads: resource.downloads + 1 }
            : resource
        )
      );
      
      // Get the resource's file_url
      const resource = resources.find(r => r.id === resourceId);
      
      if (!resource) {
        throw new Error('Resource not found');
      }
      
      // In a real implementation, we would return a downloadable URL
      // For demonstration, we'll just show a success toast
      
      toast({
        title: 'Download Started',
        description: `Downloading ${resource.title}`,
      });
      
      return { success: true, url: resource.file_url };
    } catch (error) {
      console.error('Error downloading resource:', error);
      toast({
        title: 'Download Failed',
        description: 'There was an error downloading the resource',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  // Subscribe to newsletter
  const subscribeToNewsletter = async (email: string) => {
    try {
      // In a real implementation, we would store the email in Supabase
      // For now, we'll simulate success
      
      toast({
        title: 'Subscription Successful',
        description: 'You have been subscribed to our newsletter',
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: 'Subscription Failed',
        description: 'There was an error subscribing to the newsletter',
        variant: 'destructive',
      });
      return { success: false };
    }
  };

  return {
    // Data
    news: filteredNews,
    events: filteredEvents,
    courses: filteredCourses,
    resources: filteredResources,
    
    // State
    isLoading,
    searchQuery,
    activeTab,
    
    // Actions
    setSearchQuery,
    setActiveTab,
    submitContent,
    downloadResource,
    subscribeToNewsletter,
    refreshData: fetchIndustryData
  };
};
