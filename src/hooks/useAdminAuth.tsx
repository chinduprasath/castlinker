
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/adminPermissions';
import { useEffect, useState } from "react";
import { AdminTeamRole } from '@/types/adminTypes';

interface AdminUser {
  role: string; // Use string instead of AdminTeamRole to match TeamMember
}

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    // In a real app, we would fetch the admin role from the backend
    // For this demo, we're considering emails containing "admin" as admin accounts
    // and assigning a role based on the email
    if (user && user.email.includes("admin")) {
      let role: string = 'moderator'; // default role
      
      if (user.email.includes("super")) {
        role = 'super_admin';
      } else if (user.email.includes("content")) {
        role = 'content_manager';
      } else if (user.email.includes("recruiter")) {
        role = 'recruiter';
      }
      
      setAdminUser({ role });
      setIsAdmin(true);
    } else {
      setAdminUser(null);
      setIsAdmin(false);
    }
  }, [user]);
  
  const can = (permission: string): boolean => {
    if (!adminUser) return false;
    return hasPermission(adminUser.role, permission);
  };
  
  return {
    isAdmin,
    adminUser,
    can
  };
};

export default useAdminAuth;
