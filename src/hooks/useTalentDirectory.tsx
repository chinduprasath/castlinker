
import { useState, useEffect } from 'react';
import { TalentProfile, ConnectionRequest, Profession, TalentFilters } from '@/types/talentTypes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useTalentDirectory = () => {
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [wishlistedProfiles, setWishlistedProfiles] = useState<string[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const [filters, setFilters] = useState<TalentFilters>({
    searchTerm: '',
    profession: '',
    location: '',
    minRating: 0,
    maxPrice: 1000,
    verified: false,
    available: false,
    sortBy: 'rating'
  });

  const locations = ['Los Angeles, CA', 'New York, NY', 'Atlanta, GA', 'Vancouver, BC', 'London, UK'];
  const PROFESSION_OPTIONS: Profession[] = ['Actor', 'Director', 'Producer', 'Writer', 'Cinematographer', 'Editor'];

  const { user } = useAuth();

  useEffect(() => {
    fetchTalents();
  }, [filters, currentPage]);

  const fetchTalents = async () => {
    setIsLoading(true);
    try {
      // Mock data with proper typing
      const mockTalents: TalentProfile[] = [
        {
          id: '1',
          full_name: 'Sarah Johnson',
          profession_type: 'Actor',
          location: 'Los Angeles, CA',
          avatar_url: '/placeholder.svg',
          rating: 4.8,
          is_verified: true,
          availability_status: 'available',
          skills: ['Drama', 'Comedy', 'Action'],
          experience_years: 8,
          languages: ['English', 'Spanish'],
          description: 'Experienced actor with a passion for storytelling',
          achievements: ['Best Actress Award 2023'],
          likes: 150,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          user_id: 'user1',
          name: 'Sarah Johnson',
          role: 'Actor',
          avatar: '/placeholder.svg',
          reviews: 45,
          is_premium: true,
          is_available: true,
          experience: 8,
          bio: 'Experienced actor with a passion for storytelling',
          featured_in: ['Film A', 'TV Show B']
        }
      ];
      
      setTalents(mockTalents);
      setTotalCount(mockTalents.length);
    } catch (error) {
      console.error('Error fetching talents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<TalentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      profession: '',
      location: '',
      minRating: 0,
      maxPrice: 1000,
      verified: false,
      available: false,
      sortBy: 'rating'
    });
    setCurrentPage(1);
  };

  const toggleLike = (profileId: string) => {
    setLikedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const toggleWishlist = (profileId: string) => {
    setWishlistedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const sendConnectionRequest = (profile: TalentProfile) => {
    if (!user) return false;
    
    const newRequest: ConnectionRequest = {
      id: Date.now().toString(),
      requesterId: user.id,
      recipientId: profile.id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setConnectionRequests(prev => [...prev, newRequest]);
    return true;
  };

  const shareProfile = (profile: TalentProfile) => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.name || profile.full_name}'s Profile`,
        text: `Check out ${profile.name || profile.full_name}'s profile on our platform!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied to clipboard!');
    }
  };

  const sendMessage = (profile: TalentProfile, message: string) => {
    console.log(`Sending message to ${profile.name || profile.full_name}: ${message}`);
    return true;
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return {
    talents,
    isLoading,
    filters,
    updateFilters,
    locations,
    resetFilters,
    PROFESSION_OPTIONS,
    likedProfiles,
    wishlistedProfiles,
    connectionRequests,
    totalCount,
    pageSize,
    currentPage,
    totalPages,
    toggleLike,
    toggleWishlist,
    sendConnectionRequest,
    shareProfile,
    sendMessage,
    changePage
  };
};

export default useTalentDirectory;
