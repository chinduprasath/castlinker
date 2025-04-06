
// Define role types
export type AdminRole = 'super_admin' | 'admin' | 'content_manager' | 'moderator' | 'recruiter';

// Define permission structure
export interface Permission {
  id: string;
  name: string;
  description: string;
}

// Define role structure
export interface Role {
  id: AdminRole;
  name: string;
  description: string;
  permissions: string[];
}

// List of available permissions
export const permissions: Permission[] = [
  { 
    id: 'dashboard_view', 
    name: 'View Dashboard', 
    description: 'Access to view the admin dashboard' 
  },
  { 
    id: 'user_view', 
    name: 'View Users', 
    description: 'Access to view user list' 
  },
  { 
    id: 'user_manage', 
    name: 'Manage Users', 
    description: 'Ability to edit and delete users' 
  },
  { 
    id: 'content_view', 
    name: 'View Content', 
    description: 'Access to view content' 
  },
  { 
    id: 'content_manage', 
    name: 'Manage Content', 
    description: 'Ability to modify and delete content' 
  },
  { 
    id: 'job_view', 
    name: 'View Jobs', 
    description: 'Access to view job listings' 
  },
  { 
    id: 'job_manage', 
    name: 'Manage Jobs', 
    description: 'Ability to create, edit and delete job listings' 
  },
  { 
    id: 'event_view', 
    name: 'View Events', 
    description: 'Access to view industry events' 
  },
  { 
    id: 'event_manage', 
    name: 'Manage Events', 
    description: 'Ability to create, edit and delete industry events' 
  },
  { 
    id: 'analytics_view', 
    name: 'View Analytics', 
    description: 'Access to view analytics data' 
  },
  { 
    id: 'settings_view', 
    name: 'View Settings', 
    description: 'Access to view system settings' 
  },
  { 
    id: 'settings_manage', 
    name: 'Manage Settings', 
    description: 'Ability to modify system settings' 
  },
];

// Define roles with their permissions
export const roles: Role[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full access to all features',
    permissions: [
      'dashboard_view', 'user_view', 'user_manage',
      'content_view', 'content_manage',
      'job_view', 'job_manage',
      'event_view', 'event_manage',
      'analytics_view', 'settings_view', 'settings_manage'
    ]
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'General admin access to most features',
    permissions: [
      'dashboard_view', 'user_view',
      'content_view', 'content_manage',
      'job_view', 'job_manage',
      'event_view', 'event_manage',
      'analytics_view', 'settings_view'
    ]
  },
  {
    id: 'content_manager',
    name: 'Content Manager',
    description: 'Manages content and events',
    permissions: [
      'dashboard_view',
      'content_view', 'content_manage',
      'event_view', 'event_manage'
    ]
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'Reviews and moderates content',
    permissions: [
      'dashboard_view',
      'content_view', 'content_manage'
    ]
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    description: 'Manages job listings',
    permissions: [
      'dashboard_view',
      'job_view', 'job_manage'
    ]
  }
];

// Function to check if a role has a specific permission
export const hasPermission = (role: AdminRole, permission: string): boolean => {
  const roleObj = roles.find(r => r.id === role);
  return roleObj ? roleObj.permissions.includes(permission) : false;
};
