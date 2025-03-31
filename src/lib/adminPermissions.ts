
type Role = 'super_admin' | 'moderator' | 'content_manager' | 'recruiter';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RoleDefinition {
  id: Role;
  name: string;
  description: string;
  permissions: string[];
}

// Define all possible permissions
export const permissions: Permission[] = [
  {
    id: 'user_view',
    name: 'View Users',
    description: 'Can view user profiles and details'
  },
  {
    id: 'user_create',
    name: 'Create Users',
    description: 'Can create new user accounts'
  },
  {
    id: 'user_edit',
    name: 'Edit Users',
    description: 'Can edit user details'
  },
  {
    id: 'user_delete',
    name: 'Delete Users',
    description: 'Can delete user accounts'
  },
  {
    id: 'user_verify',
    name: 'Verify Users',
    description: 'Can verify user profiles'
  },
  {
    id: 'content_view',
    name: 'View Content',
    description: 'Can view all content'
  },
  {
    id: 'content_create',
    name: 'Create Content',
    description: 'Can create new content'
  },
  {
    id: 'content_edit',
    name: 'Edit Content',
    description: 'Can edit existing content'
  },
  {
    id: 'content_delete',
    name: 'Delete Content',
    description: 'Can delete content'
  },
  {
    id: 'content_approve',
    name: 'Approve Content',
    description: 'Can approve content for publishing'
  },
  {
    id: 'job_view',
    name: 'View Jobs',
    description: 'Can view job listings'
  },
  {
    id: 'job_create',
    name: 'Create Jobs',
    description: 'Can create new job listings'
  },
  {
    id: 'job_edit',
    name: 'Edit Jobs',
    description: 'Can edit job listings'
  },
  {
    id: 'job_delete',
    name: 'Delete Jobs',
    description: 'Can delete job listings'
  },
  {
    id: 'job_verify',
    name: 'Verify Jobs',
    description: 'Can verify job listings'
  },
  {
    id: 'event_view',
    name: 'View Events',
    description: 'Can view events'
  },
  {
    id: 'event_create',
    name: 'Create Events',
    description: 'Can create new events'
  },
  {
    id: 'event_edit',
    name: 'Edit Events',
    description: 'Can edit events'
  },
  {
    id: 'event_delete',
    name: 'Delete Events',
    description: 'Can delete events'
  },
  {
    id: 'analytics_view',
    name: 'View Analytics',
    description: 'Can view analytics and reports'
  },
  {
    id: 'notification_send',
    name: 'Send Notifications',
    description: 'Can send notifications to users'
  },
  {
    id: 'settings_edit',
    name: 'Edit Settings',
    description: 'Can edit system settings'
  }
];

// Define role-based permissions
export const roles: RoleDefinition[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full access to all features and settings',
    permissions: permissions.map(p => p.id) // All permissions
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'Can moderate content and users',
    permissions: [
      'user_view', 'user_edit', 'user_verify',
      'content_view', 'content_edit', 'content_approve', 'content_delete',
      'job_view', 'job_edit', 'job_verify',
      'event_view',
      'notification_send'
    ]
  },
  {
    id: 'content_manager',
    name: 'Content Manager',
    description: 'Manages content and events',
    permissions: [
      'content_view', 'content_create', 'content_edit', 'content_delete', 'content_approve',
      'event_view', 'event_create', 'event_edit', 'event_delete'
    ]
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    description: 'Manages job listings',
    permissions: [
      'user_view',
      'job_view', 'job_create', 'job_edit', 'job_delete', 'job_verify'
    ]
  }
];

// Helper function to check if a user has a specific permission
export const hasPermission = (userRole: Role | undefined, permissionId: string): boolean => {
  if (!userRole) return false;
  
  const role = roles.find(r => r.id === userRole);
  if (!role) return false;
  
  return role.permissions.includes(permissionId);
};

// Helper function to get a list of all permissions for a role
export const getPermissionsForRole = (roleId: Role): Permission[] => {
  const role = roles.find(r => r.id === roleId);
  if (!role) return [];
  
  return permissions.filter(p => role.permissions.includes(p.id));
};
