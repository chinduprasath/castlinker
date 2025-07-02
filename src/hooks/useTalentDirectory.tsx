import { useState, useEffect } from 'react';
import { TalentProfile, ConnectionRequest, Profession, TalentFilters, PROFESSION_OPTIONS } from '@/types/talentTypes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

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
    sortBy: 'rating',
    selectedRoles: [],
    selectedLocations: [],
    experienceRange: [0, 30],
    verifiedOnly: false,
    availableOnly: false,
    likesMinimum: 0
  });

  const locations = ['Los Angeles, CA', 'New York, NY', 'Atlanta, GA', 'Vancouver, BC', 'London, UK'];

  const { user } = useAuth();

  useEffect(() => {
    fetchTalents();
  }, [filters, currentPage]);

  const fetchTalents = async () => {
    setIsLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const userTalents: TalentProfile[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          full_name: data.full_name || data.name || '',
          profession_type: data.profession_type || data.role || '',
          location: data.location || '',
          avatar_url: data.avatar_url || data.avatar || '/placeholder.svg',
          rating: data.rating || 0,
          is_verified: data.is_verified || false,
          availability_status: data.availability_status || 'available',
          skills: data.skills || [],
          experience_years: data.experience_years || data.experience || 0,
          languages: data.languages || [],
          description: data.description || '',
          achievements: data.achievements || [],
          likes: data.likes || data.likes_count || 0,
          created_at: data.created_at || '',
          updated_at: data.updated_at || '',
          user_id: doc.id,
          name: data.name || '',
          role: data.role || '',
          avatar: data.avatar || '',
          reviews: data.reviews || 0,
          is_premium: data.is_premium || false,
          is_available: data.is_available || false,
          experience: data.experience || 0,
          bio: data.bio || '',
          featured_in: data.featured_in || [],
          likes_count: data.likes_count || 0,
          joined_date: data.joined_date || '',
        };
      });
      setTalents(userTalents);
      setTotalCount(userTalents.length);
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
      sortBy: 'rating',
      selectedRoles: [],
      selectedLocations: [],
      experienceRange: [0, 30],
      verifiedOnly: false,
      availableOnly: false,
      likesMinimum: 0
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
