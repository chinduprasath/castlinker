
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  verified: boolean;
  joined_date: string;
  last_active: string;
  avatar_url?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: string;
  status: string;
  verified: boolean;
  avatar_url?: string;
  password?: string;
}

export interface UserFilters {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
}

// Define admin team roles separately from user roles
export type AdminUserRole = 'actor' | 'director' | 'producer' | 'writer' | 'cinematographer' | 'agency';
export type AdminTeamRole = 'super_admin' | 'moderator' | 'content_manager' | 'recruiter';

