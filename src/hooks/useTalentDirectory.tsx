
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from './useDebounce';
import { Profession, PROFESSION_OPTIONS, TalentProfile, TalentFilters } from '@/types/talent';

// Mock talent data for development
const MOCK_TALENT_DATA: TalentProfile[] = [
  {
    id: '1',
    userId: 'user-1',
    name: 'John Smith',
    role: 'Actor',
    location: 'Los Angeles, CA',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 4.8,
    reviews: 24,
    isVerified: true,
    isPremium: true,
    isAvailable: true,
    skills: ['Method Acting', 'Voice Acting', 'Stunts'],
    experience: 8,
    languages: ['English', 'Spanish'],
    bio: 'Award-winning actor with extensive experience in film and television.',
    featuredIn: ['The Last Stand', 'City Nights', 'Beyond the Horizon'],
    likesCount: 156,
    joinedDate: '2021-05-15'
  },
  {
    id: '2',
    userId: 'user-2',
    name: 'Sarah Johnson',
    role: 'Director',
    location: 'New York, NY',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4.9,
    reviews: 32,
    isVerified: true,
    isPremium: true,
    isAvailable: false,
    skills: ['Narrative Direction', 'Documentary', 'Music Videos'],
    experience: 12,
    languages: ['English', 'French'],
    bio: 'Passionate director focused on telling authentic and meaningful stories.',
    featuredIn: ['Silent Echo', 'Midnight Blues', 'The Journey Within'],
    likesCount: 210,
    joinedDate: '2019-03-10'
  },
  {
    id: '3',
    userId: 'user-3',
    name: 'Michael Chen',
    role: 'Cinematographer',
    location: 'Vancouver, BC',
    avatar: 'https://i.pravatar.cc/150?img=7',
    rating: 4.7,
    reviews: 19,
    isVerified: true,
    isPremium: false,
    isAvailable: true,
    skills: ['Lighting Design', 'Drone Cinematography', 'Color Grading'],
    experience: 6,
    languages: ['English', 'Mandarin'],
    bio: 'Cinematographer with a keen eye for composition and lighting.',
    featuredIn: ['Crimson Sky', 'Urban Legends', 'Distant Shores'],
    likesCount: 98,
    joinedDate: '2020-11-22'
  }
];

// Mock connection requests
const MOCK_CONNECTION_REQUESTS = [
  { id: 'conn-1', requesterId: 'user-1', recipientId: 'user-2', status: 'accepted' },
  { id: 'conn-2', requesterId: 'user-3', recipientId: 'user-1', status: 'pending' }
];

const DEFAULT_FILTERS: TalentFilters = {
  searchTerm: '',
  selectedRoles: [],
  selectedLocations: [],
  experienceRange: [0, 30],
  verifiedOnly: false,
  availableOnly: false,
  likesMinimum: 0,
  sortBy: 'rating'
};

export const useTalentDirectory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [filteredTalents, setFilteredTalents] = useState<TalentProfile[]>([]);
  const [filters, setFilters] = useState<TalentFilters>(DEFAULT_FILTERS);
  const [locations, setLocations] = useState<string[]>([]);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [wishlistedProfiles, setWishlistedProfiles] = useState<string[]>([]);
  const [connectionRequests, setConnectionRequests] = useState(MOCK_CONNECTION_REQUESTS);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);
  
  // Load talents
  useEffect(() => {
    const fetchTalents = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would call Supabase
        // For now, use mock data
        setTalents(MOCK_TALENT_DATA);
        
        // Extract unique locations
        const uniqueLocations = Array.from(new Set(MOCK_TALENT_DATA.map(talent => talent.location)));
        setLocations(uniqueLocations);
        
        // Mock some liked and wishlisted profiles
        setLikedProfiles(['1', '3']);
        setWishlistedProfiles(['2']);
      } catch (error) {
        console.error('Error fetching talents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTalents();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let results = [...talents];
    
    // Apply search term filter
    if (debouncedSearchTerm) {
      results = results.filter(talent => 
        talent.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        talent.bio.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        talent.role.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        talent.skills.some(skill => skill.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      );
    }
    
    // Apply role filter
    if (filters.selectedRoles.length > 0) {
      results = results.filter(talent => 
        filters.selectedRoles.includes(talent.role as Profession)
      );
    }
    
    // Apply location filter
    if (filters.selectedLocations.length > 0) {
      results = results.filter(talent => 
        filters.selectedLocations.includes(talent.location)
      );
    }
    
    // Apply experience range filter
    results = results.filter(talent => 
      talent.experience >= filters.experienceRange[0] && 
      talent.experience <= filters.experienceRange[1]
    );
    
    // Apply verified only filter
    if (filters.verifiedOnly) {
      results = results.filter(talent => talent.isVerified);
    }
    
    // Apply available only filter
    if (filters.availableOnly) {
      results = results.filter(talent => talent.isAvailable);
    }
    
    // Apply likes minimum filter
    if (filters.likesMinimum > 0) {
      results = results.filter(talent => talent.likesCount >= filters.likesMinimum);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        results.sort((a, b) => b.experience - a.experience);
        break;
      case 'reviews':
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'likes':
        results.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case 'nameAsc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredTalents(results);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [talents, filters, debouncedSearchTerm]);

  // Calculate pagination values
  const totalCount = filteredTalents.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedTalents = filteredTalents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // Handle toggle likes
  const toggleLike = (profileId: string) => {
    setLikedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId) 
        : [...prev, profileId]
    );
  };

  // Handle toggle wishlist
  const toggleWishlist = (profileId: string) => {
    setWishlistedProfiles(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId) 
        : [...prev, profileId]
    );
  };
  
  // Handle send connection request
  const sendConnectionRequest = (profile: TalentProfile) => {
    const newRequest = {
      id: `conn-${Date.now()}`,
      requesterId: 'current-user', // In a real app this would be the current user's ID
      recipientId: profile.userId,
      status: 'pending'
    };
    
    setConnectionRequests(prev => [...prev, newRequest]);
    return true;
  };
  
  // Handle share profile
  const shareProfile = (profile: TalentProfile) => {
    // Mock implementation
    console.log(`Sharing profile: ${profile.name}`);
    alert(`Profile of ${profile.name} would be shared in a real app.`);
  };
  
  // Handle send message
  const sendMessage = (profile: TalentProfile, message: string) => {
    // Mock implementation
    console.log(`Message to ${profile.name}: ${message}`);
    return true;
  };
  
  // Change page
  const changePage = (page: number) => {
    setCurrentPage(page);
  };
  
  // Update filters
  const updateFilters = (newFilters: Partial<TalentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  return {
    talents: paginatedTalents,
    profiles: paginatedTalents, // Alias for backward compatibility
    isLoading,
    filters,
    setFilters,
    updateFilters,
    locations,
    resetFilters: () => setFilters(DEFAULT_FILTERS),
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
export { PROFESSION_OPTIONS, type Profession };
export type { TalentProfile };
