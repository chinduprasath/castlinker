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
  joinedDate?: string;
};

export type Profession = 
  | 'Actor' 
  | 'Director' 
  | 'Producer' 
  | 'Screenwriter' 
  | 'Cinematographer' 
  | 'Editor' 
  | 'Sound Designer' 
  | 'Composer' 
  | 'Production Designer' 
  | 'Costume Designer' 
  | 'Makeup Artist' 
  | 'VFX Artist' 
  | 'Stunt Coordinator' 
  | 'Casting Director' 
  | 'Agent' 
  | 'Production Company' 
  | 'Art Director';

export const PROFESSION_OPTIONS: Profession[] = [
  'Actor',
  'Director',
  'Producer',
  'Screenwriter',
  'Cinematographer',
  'Editor',
  'Sound Designer',
  'Composer',
  'Production Designer',
  'Costume Designer',
  'Makeup Artist',
  'VFX Artist',
  'Stunt Coordinator',
  'Casting Director',
  'Agent',
  'Production Company',
  'Art Director'
];

export type TalentFilters = {
  searchTerm: string;
  selectedRoles: Profession[];
  selectedLocations: string[];
  experienceRange: [number, number];
  verifiedOnly: boolean;
  availableOnly: boolean;
  likesMinimum: number;
  sortBy: 'rating' | 'experience' | 'reviews' | 'likes' | 'nameAsc' | 'nameDesc';
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

type DatabaseProfile = {
  id: string;
  user_email: string;
  display_name: string;
  role: string;
  location: string;
  avatar_url: string;
  bio: string;
  headline: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
  website: string;
};

type GenericTable = {
  [key: string]: any;
};

export const useTalentDirectory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TalentFilters>({
    searchTerm: '',
    selectedRoles: [],
    selectedLocations: [],
    experienceRange: [0, 20],
    verifiedOnly: false,
    availableOnly: false,
    likesMinimum: 0,
    sortBy: 'nameAsc'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [wishlistedProfiles, setWishlistedProfiles] = useState<string[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let { data: dbProfiles, error } = await supabase
        .from('castlinker_escyvd_user_profiles')
        .select('*');

      if (error) throw error;

      let talentProfiles: TalentProfile[] = [];

      if (!dbProfiles || dbProfiles.length === 0) {
        talentProfiles = [
          {
            id: 'tuser-id',
            userId: 'tuser@gmail.com',
            name: 'Tom Anderson',
            role: 'Actor',
            location: 'Los Angeles, CA',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tuser',
            rating: 4.8,
            reviews: 24,
            isVerified: true,
            isPremium: false,
            isAvailable: true,
            skills: ['Method Acting', 'Stage Combat', 'Voice Acting'],
            experience: 8,
            languages: ['English'],
            bio: 'Experienced method actor with a passion for complex roles',
            featuredIn: [],
            likesCount: 156
          },
          {
            id: 'cast-id',
            userId: 'cast@gmail.com',
            name: 'Catherine Smith',
            role: 'Casting Director',
            location: 'New York, NY',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cast',
            rating: 4.9,
            reviews: 45,
            isVerified: true,
            isPremium: false,
            isAvailable: true,
            skills: ['Talent Scouting', 'Script Analysis', 'Actor Evaluation'],
            experience: 12,
            languages: ['English'],
            bio: 'Award-winning casting director with an eye for talent',
            featuredIn: [],
            likesCount: 230
          },
          {
            id: 'write-id',
            userId: 'write@gmail.com',
            name: 'William Johnson',
            role: 'Screenwriter',
            location: 'Vancouver, BC',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=write',
            rating: 4.6,
            reviews: 18,
            isVerified: true,
            isPremium: false,
            isAvailable: true,
            skills: ['Screenplay Writing', 'Story Development', 'Character Creation'],
            experience: 6,
            languages: ['English'],
            bio: 'Passionate storyteller specializing in drama and thriller genres',
            featuredIn: [],
            likesCount: 89
          }
        ];
      } else {
        talentProfiles = (dbProfiles as DatabaseProfile[]).map(profile => {
          const providedRole = profile.role;
          const isValidRole = (role: unknown): role is Profession => 
            typeof role === 'string' && 
            PROFESSION_OPTIONS.includes(role as Profession);
          
          const validatedRole = isValidRole(providedRole) ? providedRole : 'Actor';
          const role = validatedRole as Profession;

          return {
            id: profile.id,
            userId: profile.user_email,
            name: profile.display_name,
            role,
            location: profile.location || 'Remote',
            avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user_email}`,
            rating: 4.5,
            reviews: Math.floor(Math.random() * 50),
            isVerified: profile.verified || false,
            isPremium: false,
            isAvailable: true,
            skills: [],
            experience: Math.floor(Math.random() * 15) + 1,
            languages: ['English'],
            bio: profile.bio || profile.headline || 'Film industry professional',
            featuredIn: [],
            likesCount: Math.floor(Math.random() * 200)
          };
        });
      }

      try {
        let filteredProfiles = talentProfiles.filter(profile => {
          try {
            const matchesSearch = !filters.searchTerm || 
              profile.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
              profile.role.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
              profile.bio.toLowerCase().includes(filters.searchTerm.toLowerCase());
            
            const matchesRole = !filters.selectedRoles.length || 
              filters.selectedRoles.includes(profile.role);
            
            const matchesLocation = !filters.selectedLocations.length || 
              filters.selectedLocations.includes(profile.location);
            
            const matchesVerified = !filters.verifiedOnly || profile.isVerified;
            
            const matchesAvailable = !filters.availableOnly || profile.isAvailable;
            
            const matchesLikes = profile.likesCount >= filters.likesMinimum;
            
            const matchesExperience = profile.experience >= filters.experienceRange[0] && 
              profile.experience <= filters.experienceRange[1];

            return matchesSearch && 
                   matchesRole && 
                   matchesLocation && 
                   matchesVerified && 
                   matchesAvailable && 
                   matchesLikes &&
                   matchesExperience;
          } catch (filterError) {
            console.error('Error applying filters to profile:', filterError);
            return false;
          }
        });

        try {
          filteredProfiles = sortTalents(filteredProfiles);
        } catch (sortError) {
          console.error('Error sorting profiles:', sortError);
        }

        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize;
        const paginatedProfiles = filteredProfiles.slice(from, to);

        setProfiles(paginatedProfiles);
        setTotalCount(filteredProfiles.length);
        setError(null);
      } catch (filterError) {
        console.error('Error filtering profiles:', filterError);
        setError('Error filtering profiles. Some filters may not be applied correctly.');
        setProfiles(talentProfiles.slice(0, pageSize));
        setTotalCount(talentProfiles.length);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load profiles. Please try again later.');
      setProfiles([]);
      setTotalCount(0);
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
    try {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
      setError(null);
    } catch (err) {
      console.error('Error updating filters:', err);
      toast({
        title: "Error",
        description: "Failed to update filters. Please try again.",
        variant: "destructive"
      });
    }
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
      sortBy: 'nameAsc'
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

  const sortTalents = (talents: TalentProfile[]) => {
    switch (filters.sortBy) {
      case 'nameAsc':
        return [...talents].sort((a, b) => a.name.localeCompare(b.name));
      case 'nameDesc':
        return [...talents].sort((a, b) => b.name.localeCompare(a.name));
      case 'rating':
        return [...talents].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'experience':
        return [...talents].sort((a, b) => (b.experience || 0) - (a.experience || 0));
      case 'reviews':
        return [...talents].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      case 'likes':
        return [...talents].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
      default:
        return talents;
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
    error,
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
