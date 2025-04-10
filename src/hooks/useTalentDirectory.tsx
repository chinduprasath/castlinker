
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
  likesCount: number;
};

export type TalentFilters = {
  searchTerm: string;
  selectedRoles: string[];
  selectedLocations: string[];
  experienceRange: [number, number];
  verifiedOnly: boolean;
  availableOnly: boolean;
  likesMinimum: number;
  sortBy: 'rating' | 'experience' | 'reviews' | 'likes';
};

export type TalentMessage = {
  senderId: string;
  recipientId: string;
  message: string;
};

export type ConnectionRequest = {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
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
    likesMinimum: 0,
    sortBy: 'rating'
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  
  // User interaction states
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [wishlistedProfiles, setWishlistedProfiles] = useState<string[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);

  // Fetch talent profiles
  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      // Calculate pagination offsets
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // First get the total count without pagination
      const countQuery = supabase
        .from('talent_profiles')
        .select('id', { count: 'exact' });
      
      // Apply standard filters to the count query
      if (filters.verifiedOnly) {
        countQuery.eq('is_verified', true);
      }
      
      if (filters.availableOnly) {
        countQuery.eq('is_available', true);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      // Set the total count for pagination
      setTotalCount(count || 0);

      // Now fetch the actual data with pagination
      const dataQuery = supabase
        .from('talent_profiles')
        .select(`
          *,
          talent_likes(count)
        `)
        .range(from, to);
      
      // Apply filters
      if (filters.verifiedOnly) {
        dataQuery.eq('is_verified', true);
      }
      
      if (filters.availableOnly) {
        dataQuery.eq('is_available', true);
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'rating':
          dataQuery.order('rating', { ascending: false });
          break;
        case 'experience':
          dataQuery.order('experience', { ascending: false });
          break;
        case 'reviews':
          dataQuery.order('reviews', { ascending: false });
          break;
        case 'likes':
          // For now sorting by likes is handled in JS after fetching,
          // since we need to count related records
          break;
      }
      
      const { data: talentData, error } = await dataQuery;
      
      if (error) throw error;
      
      if (talentData) {
        const formattedProfiles = talentData.map(item => ({
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
          featuredIn: item.featured_in || [],
          likesCount: item.talent_likes?.length || 0
        }));
        
        // Apply more complex JS filters
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
        
        // Apply likes minimum filter
        if (filters.likesMinimum > 0) {
          filteredProfiles = filteredProfiles.filter(profile => 
            profile.likesCount >= filters.likesMinimum
          );
        }
        
        // If sorting by likes, do it here
        if (filters.sortBy === 'likes') {
          filteredProfiles.sort((a, b) => b.likesCount - a.likesCount);
        }
        
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

  // Fetch user's liked profiles
  const fetchUserLikes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('talent_likes')
        .select('talent_id')
        .eq('liker_id', user.id);
      
      if (error) throw error;
      
      const likedIds = data?.map(item => item.talent_id) || [];
      setLikedProfiles(likedIds);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  // Fetch user's wishlisted profiles
  const fetchUserWishlists = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('talent_wishlists')
        .select('talent_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const wishlistedIds = data?.map(item => item.talent_id) || [];
      setWishlistedProfiles(wishlistedIds);
    } catch (error) {
      console.error('Error fetching user wishlists:', error);
    }
  };

  // Toggle like on a talent profile
  const toggleLike = async (talentId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to like profiles",
        variant: "destructive"
      });
      return;
    }
    
    const isLiked = likedProfiles.includes(talentId);
    
    try {
      if (isLiked) {
        // Unlike the profile
        const { error } = await supabase
          .from('talent_likes')
          .delete()
          .eq('talent_id', talentId)
          .eq('liker_id', user.id);
        
        if (error) throw error;
        
        // Update local state
        setLikedProfiles(prev => prev.filter(id => id !== talentId));
        
        toast({
          title: "Success",
          description: "Removed like from profile",
        });
      } else {
        // Like the profile
        const { error } = await supabase
          .from('talent_likes')
          .insert({ 
            talent_id: talentId, 
            liker_id: user.id 
          });
        
        if (error) throw error;
        
        // Update local state
        setLikedProfiles(prev => [...prev, talentId]);
        
        toast({
          title: "Success",
          description: "Profile liked successfully",
        });
      }
      
      // Refresh to update the likes count
      fetchProfiles();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    }
  };

  // Toggle wishlist on a talent profile
  const toggleWishlist = async (talentId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to add profiles to your wishlist",
        variant: "destructive"
      });
      return;
    }
    
    const isWishlisted = wishlistedProfiles.includes(talentId);
    
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const { error } = await supabase
          .from('talent_wishlists')
          .delete()
          .eq('talent_id', talentId)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Update local state
        setWishlistedProfiles(prev => prev.filter(id => id !== talentId));
        
        toast({
          title: "Success",
          description: "Removed from wishlist",
        });
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('talent_wishlists')
          .insert({
            talent_id: talentId, 
            user_id: user.id
          });
        
        if (error) throw error;
        
        // Update local state
        setWishlistedProfiles(prev => [...prev, talentId]);
        
        toast({
          title: "Success",
          description: "Added to wishlist",
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive"
      });
    }
  };

  // Send connection request
  const sendConnectionRequest = async (recipientId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to send connection requests",
        variant: "destructive"
      });
      return;
    }
    
    // Check if a connection request already exists
    const existingConnection = connectionRequests.find(
      conn => (conn.requesterId === user.id && conn.recipientId === recipientId) ||
             (conn.requesterId === recipientId && conn.recipientId === user.id)
    );
    
    if (existingConnection) {
      toast({
        title: "Connection Request Exists",
        description: `A connection request already exists with this user`,
        variant: "default"
      });
      return;
    }
    
    try {
      // Since we can't directly access the talent_connections table through the generated types,
      // we'll use a more generic approach
      const { error } = await supabase
        .from('talent_connections')
        .insert({
          requester_id: user.id,
          recipient_id: recipientId,
          status: 'pending'
        } as any); // Use 'as any' to bypass the TypeScript error
      
      if (error) throw error;
      
      // Update the connection requests state
      const newConnection: ConnectionRequest = {
        id: 'temp-id', // Will be replaced when we fetch again
        requesterId: user.id,
        recipientId: recipientId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setConnectionRequests(prev => [...prev, newConnection]);
      
      toast({
        title: "Success",
        description: "Connection request sent",
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive"
      });
    }
  };

  // Share a talent profile
  const shareProfile = (profile: TalentProfile) => {
    // On the web, use the Web Share API if available, otherwise copy to clipboard
    if (navigator.share) {
      navigator.share({
        title: `Check out ${profile.name} on Cinema Connect`,
        text: `${profile.name} - ${profile.role} with ${profile.experience} years of experience`,
        url: window.location.href
      })
      .then(() => {
        toast({
          title: "Shared",
          description: "Profile shared successfully",
        });
      })
      .catch(error => {
        console.error('Error sharing:', error);
        copyToClipboard(profile);
      });
    } else {
      copyToClipboard(profile);
    }
  };

  // Helper function to copy profile info to clipboard
  const copyToClipboard = (profile: TalentProfile) => {
    const text = `${profile.name} - ${profile.role}\n${window.location.href}`;
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied",
          description: "Profile link copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast({
          title: "Error",
          description: "Failed to copy profile link",
          variant: "destructive"
        });
      });
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
    // Reset to first page when filters change
    setCurrentPage(1);
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
      likesMinimum: 0,
      sortBy: 'rating'
    });
    setCurrentPage(1);
  };

  // Change page
  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Fetch connection requests - modified to handle custom table structure
  const fetchConnectionRequests = async () => {
    if (!user) return;
    
    try {
      // Since we can't directly access the talent_connections table through the generated types,
      // we'll use a raw SQL query via a function or a more generic approach
      const { data, error } = await supabase
        .rpc('get_user_connections', { user_id: user.id });
      
      if (!error && data) {
        const formattedConnections: ConnectionRequest[] = data.map((item: any) => ({
          id: item.id,
          requesterId: item.requester_id,
          recipientId: item.recipient_id,
          status: item.status,
          createdAt: item.created_at
        }));
        setConnectionRequests(formattedConnections);
      } else {
        // Fallback if the RPC function doesn't exist
        // Just store an empty array for now - in production we would handle this properly
        setConnectionRequests([]);
        console.error("Couldn't fetch connection requests:", error);
      }
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      setConnectionRequests([]);
    }
  };

  // Load talent profiles on initial render and when filters or pagination changes
  useEffect(() => {
    fetchProfiles();
  }, [filters, currentPage]);

  // Load user interactions on mount and when user changes
  useEffect(() => {
    fetchUserLikes();
    fetchUserWishlists();
    fetchConnectionRequests();
  }, [user]);

  return {
    profiles,
    isLoading,
    filters,
    likedProfiles,
    wishlistedProfiles,
    connectionRequests,
    totalCount,
    pageSize,
    currentPage,
    totalPages,
    updateFilters,
    resetFilters,
    sendMessage,
    toggleLike,
    toggleWishlist,
    shareProfile,
    changePage,
    sendConnectionRequest,
    refetchProfiles: fetchProfiles
  };
};
