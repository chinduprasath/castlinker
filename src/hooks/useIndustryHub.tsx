
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime?: string;
  category?: string;
  image?: string;
  author: {
    name: string;
    avatar: string;
  };
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  type?: string;
  location?: string;
  image?: string;
  isFeatured?: boolean;
};

export type CourseItem = {
  id: string;
  title: string;
  instructor: string;
  lessons?: number;
  hours?: number;
  level?: string;
  rating?: number;
  reviews?: number;
  image?: string;
};

export type ResourceItem = {
  id: string;
  title: string;
  type: string;
  downloads?: number;
  image?: string;
  fileUrl?: string;
};

export const useIndustryHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<EventItem | null>(null);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [featuredCourse, setFeaturedCourse] = useState<CourseItem | null>(null);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState({
    news: false,
    events: false,
    courses: false,
    resources: false
  });

  // Fetch news and insights
  const fetchNews = async () => {
    setIsLoading(prev => ({ ...prev, news: true }));
    try {
      // Get featured news
      const { data: featuredData, error: featuredError } = await supabase
        .from('industry_news')
        .select()
        .eq('is_featured', true)
        .limit(1)
        .single();
      
      if (featuredError && featuredError.code !== 'PGRST116') {
        console.error('Error fetching featured news:', featuredError);
      } else if (featuredData) {
        setFeaturedNews({
          id: featuredData.id,
          title: featuredData.title,
          excerpt: featuredData.excerpt,
          content: featuredData.content,
          date: new Date(featuredData.date).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
          }),
          readTime: featuredData.read_time,
          category: featuredData.category,
          image: featuredData.image,
          author: {
            name: featuredData.author_name || 'Unknown Author',
            avatar: featuredData.author_avatar || '/placeholder.svg'
          }
        });
      }
      
      // Get regular news items
      const { data, error } = await supabase
        .from('industry_news')
        .select()
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      
      if (data) {
        const formattedNews = data.map(item => ({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          content: item.content,
          date: new Date(item.date).toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
          }),
          readTime: item.read_time,
          category: item.category,
          image: item.image,
          author: {
            name: item.author_name || 'Unknown Author',
            avatar: item.author_avatar || '/placeholder.svg'
          }
        }));
        
        setNews(formattedNews);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to load news data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, news: false }));
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    setIsLoading(prev => ({ ...prev, events: true }));
    try {
      // Get featured event
      const { data: featuredData, error: featuredError } = await supabase
        .from('industry_events')
        .select()
        .eq('is_featured', true)
        .limit(1)
        .single();
      
      if (featuredError && featuredError.code !== 'PGRST116') {
        console.error('Error fetching featured event:', featuredError);
      } else if (featuredData) {
        setFeaturedEvent({
          id: featuredData.id,
          title: featuredData.title,
          description: featuredData.description,
          date: featuredData.date,
          time: featuredData.time,
          type: featuredData.type,
          location: featuredData.location,
          image: featuredData.image,
          isFeatured: true
        });
      }
      
      // Get regular events
      const { data, error } = await supabase
        .from('industry_events')
        .select()
        .order('date', { ascending: true })
        .limit(6);
      
      if (error) throw error;
      
      if (data) {
        const formattedEvents = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          date: item.date,
          time: item.time,
          type: item.type,
          location: item.location,
          image: item.image,
          isFeatured: item.is_featured
        }));
        
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, events: false }));
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    setIsLoading(prev => ({ ...prev, courses: true }));
    try {
      // Get featured course
      const { data: featuredData, error: featuredError } = await supabase
        .from('industry_courses')
        .select()
        .eq('is_featured', true)
        .limit(1)
        .single();
      
      if (featuredError && featuredError.code !== 'PGRST116') {
        console.error('Error fetching featured course:', featuredError);
      } else if (featuredData) {
        setFeaturedCourse({
          id: featuredData.id,
          title: featuredData.title,
          instructor: featuredData.instructor,
          lessons: featuredData.lessons,
          hours: Number(featuredData.hours),
          level: featuredData.level,
          rating: Number(featuredData.rating),
          reviews: featuredData.reviews,
          image: featuredData.image
        });
      }
      
      // Get regular courses
      const { data, error } = await supabase
        .from('industry_courses')
        .select()
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      
      if (data) {
        const formattedCourses = data.map(item => ({
          id: item.id,
          title: item.title,
          instructor: item.instructor,
          lessons: item.lessons,
          hours: Number(item.hours),
          level: item.level,
          rating: Number(item.rating),
          reviews: item.reviews,
          image: item.image
        }));
        
        setCourses(formattedCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, courses: false }));
    }
  };

  // Fetch resources
  const fetchResources = async () => {
    setIsLoading(prev => ({ ...prev, resources: true }));
    try {
      const { data, error } = await supabase
        .from('industry_resources')
        .select()
        .order('downloads', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      
      if (data) {
        const formattedResources = data.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          downloads: item.downloads,
          image: item.image,
          fileUrl: item.file_url
        }));
        
        setResources(formattedResources);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, resources: false }));
    }
  };

  // Submission functions
  const submitNews = async (newsData: Omit<NewsItem, 'id' | 'author'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit news",
        variant: "destructive"
      });
      return { success: false };
    }
    
    try {
      const { data, error } = await supabase
        .from('industry_news')
        .insert({
          title: newsData.title,
          excerpt: newsData.excerpt,
          content: newsData.content,
          date: new Date().toISOString(),
          read_time: newsData.readTime,
          category: newsData.category,
          image: newsData.image,
          author_id: user.id,
          author_name: user.email, // Using email as fallback since user_metadata isn't available
          author_avatar: '/placeholder.svg'
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your news has been submitted",
      });
      
      await fetchNews();
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting news:', error);
      toast({
        title: "Error",
        description: "Failed to submit news",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const submitEvent = async (eventData: Omit<EventItem, 'id'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit an event",
        variant: "destructive"
      });
      return { success: false };
    }
    
    try {
      const { data, error } = await supabase
        .from('industry_events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          type: eventData.type,
          location: eventData.location,
          image: eventData.image,
          is_featured: false,
          created_by: user.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your event has been submitted",
      });
      
      await fetchEvents();
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting event:', error);
      toast({
        title: "Error",
        description: "Failed to submit event",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const submitCourse = async (courseData: Omit<CourseItem, 'id'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a course",
        variant: "destructive"
      });
      return { success: false };
    }
    
    try {
      const { data, error } = await supabase
        .from('industry_courses')
        .insert({
          title: courseData.title,
          instructor: courseData.instructor,
          lessons: courseData.lessons,
          hours: courseData.hours,
          level: courseData.level,
          rating: courseData.rating || 0,
          reviews: courseData.reviews || 0,
          image: courseData.image,
          is_featured: false,
          created_by: user.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your course has been submitted",
      });
      
      await fetchCourses();
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting course:', error);
      toast({
        title: "Error",
        description: "Failed to submit course",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const submitResource = async (resourceData: Omit<ResourceItem, 'id' | 'downloads'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a resource",
        variant: "destructive"
      });
      return { success: false };
    }
    
    try {
      const { data, error } = await supabase
        .from('industry_resources')
        .insert({
          title: resourceData.title,
          type: resourceData.type,
          downloads: 0,
          image: resourceData.image,
          file_url: resourceData.fileUrl,
          created_by: user.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your resource has been submitted",
      });
      
      await fetchResources();
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting resource:', error);
      toast({
        title: "Error",
        description: "Failed to submit resource",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const incrementResourceDownloads = async (resourceId: string) => {
    try {
      // Get current download count
      const { data: resource, error: fetchError } = await supabase
        .from('industry_resources')
        .select('downloads')
        .eq('id', resourceId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Increment download count
      const { error: updateError } = await supabase
        .from('industry_resources')
        .update({ downloads: (resource.downloads || 0) + 1 })
        .eq('id', resourceId);
      
      if (updateError) throw updateError;
      
      // Refresh resources
      await fetchResources();
      return true;
    } catch (error) {
      console.error('Error incrementing download count:', error);
      return false;
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchNews();
    fetchEvents();
    fetchCourses();
    fetchResources();
  }, []);

  return {
    news,
    featuredNews,
    events,
    featuredEvent,
    courses,
    featuredCourse,
    resources,
    isLoading,
    submitNews,
    submitEvent,
    submitCourse,
    submitResource,
    incrementResourceDownloads,
    refetch: {
      news: fetchNews,
      events: fetchEvents,
      courses: fetchCourses,
      resources: fetchResources
    }
  };
};
