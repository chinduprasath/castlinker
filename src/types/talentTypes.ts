
export interface TalentProfile {
  id: string;
  full_name: string;
  profession_type: string;
  location: string;
  avatar_url: string;
  rating: number;
  is_verified: boolean;
  availability_status: 'available' | 'busy' | 'unavailable';
  skills: string[];
  experience_years: number;
  languages: string[];
  description: string;
  achievements: string[];
  likes: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
  name?: string;
  role?: string;
  avatar?: string;
  reviews?: number;
  is_premium?: boolean;
  is_available?: boolean;
  experience?: number;
  bio?: string;
  featured_in?: string[];
}

export interface ConnectionRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export type Profession = 'Actor' | 'Director' | 'Producer' | 'Writer' | 'Cinematographer' | 'Editor';

export interface TalentFilters {
  searchTerm: string;
  profession: Profession | '';
  location: string;
  minRating: number;
  maxPrice: number;
  verified: boolean;
  available: boolean;
  sortBy: string;
}
