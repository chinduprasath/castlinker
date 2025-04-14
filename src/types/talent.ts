
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
