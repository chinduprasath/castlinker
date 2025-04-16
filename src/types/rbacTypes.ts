
export type AdminModule = 'posts' | 'users' | 'jobs' | 'events' | 'content' | 'team';

export interface AdminRoleWithPermissions {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  permissions: AdminPermission[];
  created_at: string;
  updated_at: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminPermission {
  id: string;
  role_id: string;
  module: AdminModule;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_view: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminTeamMember {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  role_name: string;
  joined_date: string;
  avatar_url?: string;
  status: 'active' | 'suspended' | 'pending';
}
