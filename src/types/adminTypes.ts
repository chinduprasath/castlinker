// Define admin user roles (for regular users managed by admins)
export type AdminUserRole = 'actor' | 'director' | 'producer' | 'writer' | 'cinematographer' | 'agency';

// Define admin team roles (for admin team members)
export type AdminTeamRole = 'super_admin' | 'moderator' | 'content_manager' | 'recruiter';

// Define all possible role types for user_management table
export type UserManagementRole = AdminUserRole | AdminTeamRole;

// Create a database role type to match what the Supabase schema expects
export type DatabaseRole = AdminUserRole;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserManagementRole;
  status: 'active' | 'suspended' | 'pending';
  verified: boolean;
  joined_date: string;
  last_active: string;
  avatar_url?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserManagementRole;
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

// This interface matches the database structure
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminTeamRole;
  joined_date: string;
  avatar_url?: string;
}

// Define admin profile data type
export interface AdminProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}
