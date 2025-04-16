import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/adminPermissions';
import { useEffect, useState } from "react";
import { AdminTeamRole } from '@/types/adminTypes';
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";

interface AdminUser {
  role: AdminTeamRole;
  name?: string;
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
          
          // Get actual admin role from database using admin client
          const { data: adminData, error } = await supabaseAdmin
            .from('users_management')
            .select('role, name')
            .eq('email', user.email.toLowerCase())
            .single();
          
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
            const role = String(adminData.role).toLowerCase().trim();
            console.log('Role as string:', role);
            
            // Check specifically for super_admin role
            if (role === 'super_admin') {
              console.log('User is a super_admin');
              setAdminUser({ 
                role: 'super_admin',
                name: adminData.name 
              });
              setIsAdmin(true);
            } else {
              console.log('User is not a super_admin:', role);
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
    // Super admin has all permissions
    if (adminUser.role === 'super_admin') return true;
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
