
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type TalentProfile = {
  id: string;
  userId: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  reviews: number;
  isVerified: boolean;
  isPremium: boolean;
  isAvailable: boolean;
  skills: string[];
  experience: number;
  languages: string[];
  bio: string;
  featuredIn: string[];
};

export type TalentFilters = {
  searchTerm: string;
  selectedRoles: string[];
  selectedLocations: string[];
  experienceRange: [number, number];
  verifiedOnly: boolean;
  availableOnly: boolean;
  sortBy: 'rating' | 'experience' | 'reviews';
};

export type TalentMessage = {
  senderId: string;
  recipientId: string;
  message: string;
};

export const useTalentDirectory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<TalentFilters>({
    searchTerm: '',
    selectedRoles: [],
    selectedLocations: [],
    experienceRange: [0, 20],
    verifiedOnly: false,
    availableOnly: false,
    sortBy: 'rating'
  });

  // Fetch talent profiles
  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      // Use a typed query to avoid type issues
      const { data, error } = await supabase
        .from('talent_profiles')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        const formattedProfiles = data.map(item => ({
          id: item.id,
          userId: item.user_id,
          name: item.name,
          role: item.role,
          location: item.location,
          avatar: item.avatar || '/placeholder.svg',
          rating: Number(item.rating) || 0,
          reviews: item.reviews || 0,
          isVerified: item.is_verified,
          isPremium: item.is_premium,
          isAvailable: item.is_available,
          skills: item.skills || [],
          experience: item.experience || 0,
          languages: item.languages || [],
          bio: item.bio || '',
          featuredIn: item.featured_in || []
        }));
        
        // Apply filters in JavaScript for now
        let filteredProfiles = [...formattedProfiles];
        
        // Apply search filter
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filteredProfiles = filteredProfiles.filter(profile => 
            profile.name.toLowerCase().includes(term) ||
            profile.role.toLowerCase().includes(term) ||
            profile.bio.toLowerCase().includes(term)
          );
        }
        
        // Apply role filter
        if (filters.selectedRoles.length > 0) {
          filteredProfiles = filteredProfiles.filter(profile => 
            filters.selectedRoles.includes(profile.role)
          );
        }
        
        // Apply location filter
        if (filters.selectedLocations.length > 0) {
          filteredProfiles = filteredProfiles.filter(profile => 
            filters.selectedLocations.includes(profile.location)
          );
        }
        
        // Apply experience range filter
        filteredProfiles = filteredProfiles.filter(profile => 
          profile.experience >= filters.experienceRange[0] && 
          profile.experience <= filters.experienceRange[1]
        );
        
        // Apply verified only filter
        if (filters.verifiedOnly) {
          filteredProfiles = filteredProfiles.filter(profile => profile.isVerified);
        }
        
        // Apply available only filter
        if (filters.availableOnly) {
          filteredProfiles = filteredProfiles.filter(profile => profile.isAvailable);
        }
        
        // Apply sorting
        filteredProfiles.sort((a, b) => {
          switch (filters.sortBy) {
            case 'rating':
              return b.rating - a.rating;
            case 'experience':
              return b.experience - a.experience;
            case 'reviews':
              return b.reviews - a.reviews;
            default:
              return 0;
          }
        });
        
        setProfiles(filteredProfiles);
      }
    } catch (error) {
      console.error('Error fetching talent profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load talent profiles",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send message to talent
  const sendMessage = async (talentId: string, message: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to send messages",
        variant: "destructive"
      });
      return { success: false };
    }
    
    try {
      // Get the user_id for the talent profile
      const { data: profileData, error: profileError } = await supabase
        .from('talent_profiles')
        .select('user_id')
        .eq('id', talentId)
        .single();
      
      if (profileError) throw profileError;
      if (!profileData) throw new Error('Talent profile not found');
      
      // Insert message
      const { data, error } = await supabase
        .from('talent_messages')
        .insert({
          sender_id: user.id,
          recipient_id: profileData.user_id,
          message
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your message has been sent",
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<TalentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      selectedRoles: [],
      selectedLocations: [],
      experienceRange: [0, 20],
      verifiedOnly: false,
      availableOnly: false,
      sortBy: 'rating'
    });
  };

  // Load talent profiles on initial render and when filters change
  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  return {
    profiles,
    isLoading,
    filters,
    updateFilters,
    resetFilters,
    sendMessage,
    refetchProfiles: fetchProfiles
  };
};
