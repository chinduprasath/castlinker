

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

// Define admin user roles (for regular users managed by admins)
export type AdminUserRole = 'actor' | 'director' | 'producer' | 'writer' | 'cinematographer' | 'agency';

// Define admin team roles (for admin team members)
export type AdminTeamRole = 'super_admin' | 'moderator' | 'content_manager' | 'recruiter';

// This interface matches the database structure
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminTeamRole | AdminUserRole; // Allow both role types to match database
  joined_date: string;
  avatar_url?: string;
}

