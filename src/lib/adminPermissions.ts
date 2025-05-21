// Define the permissions for each role
const rolePermissions: Record<string, string[]> = {
  super_admin: [
    'user_view', 'user_edit', 'user_delete', 'user_create',
    'content_view', 'content_edit', 'content_delete',
    'job_view', 'job_edit', 'job_delete',
    'event_view', 'event_edit', 'event_delete',
    'setting_view', 'setting_edit',
    'ticket_view', 'ticket_edit', 'ticket_delete' // Added ticket permissions
  ],
  moderator: [
    'user_view',
    'content_view', 'content_edit', 'content_delete',
    'job_view',
    'event_view',
    'ticket_view' // Added ticket view permission
  ],
  content_manager: [
    'content_view', 'content_edit', 'content_delete',
    'job_view', 'job_edit',
    'event_view', 'event_edit'
  ],
  recruiter: [
    'job_view', 'job_edit', 'job_delete',
    'user_view'
  ]
};

// Define permission objects for UI display
export const permissions = [
  { id: 'user_view', name: 'View Users', description: 'Can view user profiles and information' },
  { id: 'user_edit', name: 'Edit Users', description: 'Can edit user information' },
  { id: 'user_delete', name: 'Delete Users', description: 'Can delete user accounts' },
  { id: 'user_create', name: 'Create Users', description: 'Can create new user accounts' },
  { id: 'content_view', name: 'View Content', description: 'Can view all content' },
  { id: 'content_edit', name: 'Edit Content', description: 'Can edit content' },
  { id: 'content_delete', name: 'Delete Content', description: 'Can delete content' },
  { id: 'job_view', name: 'View Jobs', description: 'Can view all job listings' },
  { id: 'job_edit', name: 'Edit Jobs', description: 'Can edit job listings' },
  { id: 'job_delete', name: 'Delete Jobs', description: 'Can delete job listings' },
  { id: 'event_view', name: 'View Events', description: 'Can view all events' },
  { id: 'event_edit', name: 'Edit Events', description: 'Can edit events' },
  { id: 'event_delete', name: 'Delete Events', description: 'Can delete events' },
  { id: 'setting_view', name: 'View Settings', description: 'Can view system settings' },
  { id: 'setting_edit', name: 'Edit Settings', description: 'Can modify system settings' },
  { id: 'ticket_view', name: 'View Tickets', description: 'Can view support tickets' },
  { id: 'ticket_edit', name: 'Edit Tickets', description: 'Can edit and update tickets' },
  { id: 'ticket_delete', name: 'Delete Tickets', description: 'Can delete tickets' }
];

// Define role objects for UI display
export const roles = [
  { 
    id: 'super_admin', 
    name: 'Super Admin', 
    description: 'Full access to all system features and settings',
    permissions: rolePermissions.super_admin
  },
  { 
    id: 'moderator', 
    name: 'Moderator', 
    description: 'Can moderate content and view basic information',
    permissions: rolePermissions.moderator
  },
  { 
    id: 'content_manager', 
    name: 'Content Manager', 
    description: 'Manages content, events, and job listings',
    permissions: rolePermissions.content_manager
  },
  { 
    id: 'recruiter', 
    name: 'Recruiter', 
    description: 'Manages job listings and can view user profiles',
    permissions: rolePermissions.recruiter
  }
];

// Check if a role has a specific permission
export const hasPermission = (role: string, permission: string): boolean => {
  return rolePermissions[role]?.includes(permission) || false;
};

export default hasPermission;
