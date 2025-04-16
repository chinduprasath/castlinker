
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/adminPermissions';
import { useEffect, useState } from "react";
import { AdminTeamRole } from '@/types/adminTypes';
import { supabase } from "@/integrations/supabase/client";

interface AdminUser {
  role: AdminTeamRole;
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
        console.log('useAdminAuth: Checking admin status for', user.email);
        
        try {
          // First check if user is authenticated with Supabase
          const { data: sessionData } = await supabase.auth.getSession();
          
          if (!sessionData.session) {
            console.log('No active Supabase session found');
            setAdminUser(null);
            setIsAdmin(false);
            setLoading(false);
            return;
          }
          
          // Get actual admin role from database
          const { data: adminData, error } = await supabase
            .from('users_management')
            .select('role')
            .eq('email', user.email.toLowerCase()) // Ensure we use lowercase for comparison
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching admin data:', error);
            setAdminUser(null);
            setIsAdmin(false);
            setLoading(false);
            return;
          }
          
          if (adminData) {
            console.log('Admin user found:', adminData);
            
            // Ensure we handle the role as a string to avoid type issues
            const role = String(adminData.role);
            console.log('Role as string:', role);
            
            // List of valid admin roles
            const adminRoles = ['super_admin', 'moderator', 'content_manager', 'recruiter'];
            
            if (adminRoles.includes(role)) {
              // Map string role to AdminTeamRole enum
              const adminRole = role as AdminTeamRole;
              
              console.log('Mapped to AdminTeamRole:', adminRole);
              setAdminUser({ role: adminRole });
              setIsAdmin(true);
            } else {
              console.log('Role not recognized as admin role:', role);
              setAdminUser(null);
              setIsAdmin(false);
            }
          } else {
            console.log('Not an admin user: No admin data found');
            setAdminUser(null);
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('Error checking admin status:', err);
          setAdminUser(null);
          setIsAdmin(false);
        }
      } else {
        console.log('No user found or missing email');
        setAdminUser(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    };
    
    fetchAdminRole();
  }, [user]);
  
  const can = (permission: string): boolean => {
    if (!adminUser) return false;
    const hasPermissionResult = hasPermission(adminUser.role, permission);
    console.log(`Checking permission "${permission}" for role "${adminUser.role}": ${hasPermissionResult}`);
    return hasPermissionResult;
  };
  
  return {
    isAdmin,
    adminUser,
    can,
    loading
  };
};

export default useAdminAuth;
