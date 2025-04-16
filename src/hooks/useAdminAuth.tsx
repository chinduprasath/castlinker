
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/adminPermissions';
import { useEffect, useState } from "react";
import { AdminTeamRole } from '@/types/adminTypes';
import { supabase } from "@/integrations/supabase/client";

interface AdminUser {
  role: AdminTeamRole; // Use AdminTeamRole for admin users
}

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchAdminRole = async () => {
      setLoading(true);
      
      if (user && user.email) {
        try {
          // Get actual admin role from database
          const { data: adminData, error } = await supabase
            .from('users_management')
            .select('role')
            .eq('email', user.email)
            .single();
          
          if (!error && adminData) {
            console.log('Admin user found:', adminData);
            // Ensure we handle the role as a string to avoid type issues
            const role = String(adminData.role);
            
            // Map string role to AdminTeamRole enum
            const adminRole: AdminTeamRole = 
              role === 'super_admin' ? 'super_admin' : 
              role === 'moderator' ? 'moderator' : 
              role === 'content_manager' ? 'content_manager' : 
              role === 'recruiter' ? 'recruiter' : 'moderator';
            
            setAdminUser({ role: adminRole });
            setIsAdmin(true);
          } else {
            console.log('Not an admin user:', error);
            setAdminUser(null);
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('Error checking admin status:', err);
          setAdminUser(null);
          setIsAdmin(false);
        }
      } else {
        setAdminUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    };
    
    fetchAdminRole();
  }, [user]);
  
  const can = (permission: string): boolean => {
    if (!adminUser) return false;
    return hasPermission(adminUser.role, permission);
  };
  
  return {
    isAdmin,
    adminUser,
    can,
    loading
  };
};

export default useAdminAuth;
