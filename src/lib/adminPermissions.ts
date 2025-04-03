
// Define the permissions for each role
const rolePermissions: Record<string, string[]> = {
  super_admin: [
    'user_view', 'user_edit', 'user_delete',
    'content_view', 'content_edit', 'content_delete',
    'job_view', 'job_edit', 'job_delete',
    'event_view', 'event_edit', 'event_delete',
    'setting_view', 'setting_edit'
  ],
  moderator: [
    'user_view',
    'content_view', 'content_edit', 'content_delete',
    'job_view',
    'event_view'
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

// Check if a role has a specific permission
export const hasPermission = (role: string, permission: string): boolean => {
  return rolePermissions[role]?.includes(permission) || false;
};

export default hasPermission;
