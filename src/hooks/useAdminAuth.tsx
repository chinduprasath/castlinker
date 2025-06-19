
// Mock admin authentication hook since Supabase auth was removed
export const useAdminAuth = () => {
  // Mock admin user data - everyone is considered an admin
  const mockAdminUser = {
    id: "mock-admin",
    name: "Mock Admin",
    email: "admin@castlinker.com",
    role: "super_admin"
  };

  const mockAdminRole = {
    name: "Super Admin",
    permissions: ["all"]
  };

  return {
    isAdmin: true,
    adminUser: mockAdminUser,
    adminRole: mockAdminRole,
    loading: false,
    hasPermission: (module: string, action: string) => true, // Allow all permissions
    can: (permission: string) => true, // Allow all permissions
  };
};
