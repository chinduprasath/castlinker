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
  message?: string;
};

type GenericTable = {
  [key: string]: any;
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [wishlistedProfiles, setWishlistedProfiles] = useState<string[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const countQuery = supabase
        .from('talent_profiles')
        .select('id', { count: 'exact' });
      
      if (filters.verifiedOnly) {
        countQuery.eq('is_verified', true);
      }
      
      if (filters.availableOnly) {
        countQuery.eq('is_available', true);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      setTotalCount(count || 0);

      const dataQuery = supabase
        .from('talent_profiles')
        .select(`
          *,
          talent_likes(count)
        `)
        .range(from, to);
      
      if (filters.verifiedOnly) {
        dataQuery.eq('is_verified', true);
      }
      
      if (filters.availableOnly) {
        dataQuery.eq('is_available', true);
      }
      
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
        
        let filteredProfiles = [...formattedProfiles];
        
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filteredProfiles = filteredProfiles.filter(profile => 
            profile.name.toLowerCase().includes(term) ||
            profile.role.toLowerCase().includes(term) ||
            profile.bio.toLowerCase().includes(term)
          );
        }
        
        if (filters.selectedRoles.length > 0) {
          filteredProfiles = filteredProfiles.filter(profile => 
            filters.selectedRoles.includes(profile.role)
          );
        }
        
        if (filters.selectedLocations.length > 0) {
          filteredProfiles = filteredProfiles.filter(profile => 
            filters.selectedLocations.includes(profile.location)
          );
        }
        
        filteredProfiles = filteredProfiles.filter(profile => 
          profile.experience >= filters.experienceRange[0] && 
          profile.experience <= filters.experienceRange[1]
        );
        
        if (filters.likesMinimum > 0) {
          filteredProfiles = filteredProfiles.filter(profile => 
            profile.likesCount >= filters.likesMinimum
          );
        }
        
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
        const { error } = await supabase
          .from('talent_likes')
          .delete()
          .eq('talent_id', talentId)
          .eq('liker_id', user.id);
        
        if (error) throw error;
        
        setLikedProfiles(prev => prev.filter(id => id !== talentId));
        
        toast({
          title: "Success",
          description: "Removed like from profile",
        });
      } else {
        const { error } = await supabase
          .from('talent_likes')
          .insert({ 
            talent_id: talentId, 
            liker_id: user.id 
          });
        
        if (error) throw error;
        
        setLikedProfiles(prev => [...prev, talentId]);
        
        toast({
          title: "Success",
          description: "Profile liked successfully",
        });
      }
      
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
        const { error } = await supabase
          .from('talent_wishlists')
          .delete()
          .eq('talent_id', talentId)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setWishlistedProfiles(prev => prev.filter(id => id !== talentId));
        
        toast({
          title: "Success",
          description: "Removed from wishlist",
        });
      } else {
        const { error } = await supabase
          .from('talent_wishlists')
          .insert({
            talent_id: talentId, 
            user_id: user.id
          });
        
        if (error) throw error;
        
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

  const sendConnectionRequest = async (recipientId: string, message: string = '') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to send connection requests",
        variant: "destructive"
      });
      return;
    }
    
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
      const { error } = await (supabase
        .from('talent_connections' as any)
        .insert({
          requester_id: user.id,
          recipient_id: recipientId,
          status: 'pending',
          message: message
        }) as unknown as { error: any });
      
      if (error) throw error;
      
      const newConnection: ConnectionRequest = {
        id: 'temp-id',
        requesterId: user.id,
        recipientId: recipientId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        message: message
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

  const shareProfile = (profile: TalentProfile) => {
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
      const { data: profileData, error: profileError } = await supabase
        .from('talent_profiles')
        .select('user_id')
        .eq('id', talentId)
        .single();
      
      if (profileError) throw profileError;
      if (!profileData) throw new Error('Talent profile not found');
      
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

  const updateFilters = (newFilters: Partial<TalentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

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

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchConnectionRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await (supabase
        .from('talent_connections' as any)
        .select('*')
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id})`) as unknown as { data: any[], error: any });
      
      if (error) {
        console.error("Couldn't fetch connection requests:", error);
        return;
      }
      
      if (data) {
        const formattedConnections: ConnectionRequest[] = data.map((item: any) => ({
          id: item.id,
          requesterId: item.requester_id,
          recipientId: item.recipient_id,
          status: item.status,
          createdAt: item.created_at,
          message: item.message
        }));
        setConnectionRequests(formattedConnections);
      }
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      setConnectionRequests([]);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [filters, currentPage]);

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
