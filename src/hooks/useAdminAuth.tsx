
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission as legacyHasPermission } from '@/lib/adminPermissions';
import { useEffect, useState } from "react";
import { AdminTeamRole } from '@/types/adminTypes';
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";
import { AdminModule, AdminPermission, AdminRole } from '@/types/rbacTypes';

interface AdminUser {
  id: string;
  role: AdminTeamRole;
  role_id: string | null;
  name?: string;
  permissions: AdminPermission[];
}

export const useAdminAuth = () => {
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
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
            setAdminRole(null);
            setIsAdmin(false);
            setLoading(false);
            return;
          }
          
          // Get actual admin role from database using admin client
          const { data: adminData, error } = await supabaseAdmin
            .from('users_management')
            .select('id, role, name')
            .eq('email', user.email.toLowerCase())
            .single();
          
          if (error) {
            console.error('Error fetching admin data:', error);
            setAdminUser(null);
            setAdminRole(null);
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
              
              try {
                // Try to get the SuperAdmin role from the new roles table
                // Use type assertion for tables not in Supabase types
                const { data: superAdminRoleData } = await (supabaseAdmin
                  .from('admin_roles' as any)
                  .select('*')
                  .eq('name', 'SuperAdmin')
                  .single() as any);
                
                if (superAdminRoleData) {
                  // Map to AdminRole type
                  const superAdminRole: AdminRole = {
                    id: superAdminRoleData.id,
                    name: superAdminRoleData.name,
                    description: superAdminRoleData.description,
                    is_system: superAdminRoleData.is_system,
                    created_at: superAdminRoleData.created_at,
                    updated_at: superAdminRoleData.updated_at
                  };
                  
                  setAdminRole(superAdminRole);
                  
                  // Get all permissions for SuperAdmin
                  // Use type assertion for tables not in Supabase types
                  const { data: permissionsData } = await (supabaseAdmin
                    .from('admin_permissions' as any)
                    .select('*')
                    .eq('role_id', superAdminRole.id) as any);
                  
                  // Create typed permissions array
                  const typedPermissions: AdminPermission[] = permissionsData ? 
                    permissionsData.map((p: any) => ({
                      id: p.id,
                      role_id: p.role_id,
                      module: p.module as AdminModule,
                      can_create: p.can_create,
                      can_edit: p.can_edit,
                      can_delete: p.can_delete,
                      can_view: p.can_view,
                      created_at: p.created_at,
                      updated_at: p.updated_at
                    })) : [];
                  
                  setAdminUser({
                    id: adminData.id,
                    role: 'super_admin',
                    role_id: superAdminRole.id,
                    name: adminData.name,
                    permissions: typedPermissions
                  });
                } else {
                  // Fallback to default SuperAdmin permissions
                  setAdminUser({
                    id: adminData.id,
                    role: 'super_admin',
                    role_id: null,
                    name: adminData.name,
                    permissions: [] // Legacy super_admin has all permissions
                  });
                }
                
                setIsAdmin(true);
              } catch (err) {
                console.error('Error fetching SuperAdmin role:', err);
                
                // Fallback to legacy super_admin role
                setAdminUser({
                  id: adminData.id,
                  role: 'super_admin',
                  role_id: null,
                  name: adminData.name,
                  permissions: [] // Empty permissions for legacy
                });
                setIsAdmin(true);
              }
            } else {
              console.log('User is not a super_admin:', role);
              setAdminUser(null);
              setAdminRole(null);
              setIsAdmin(false);
            }
          } else {
            console.log('Not an admin user: No admin data found');
            setAdminUser(null);
            setAdminRole(null);
            setIsAdmin(false);
          }
        } catch (err) {
          console.error('Error checking admin status:', err);
          setAdminUser(null);
          setAdminRole(null);
          setIsAdmin(false);
        }
      } else {
        console.log('No user found or missing email');
        setAdminUser(null);
        setAdminRole(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
    };
    
    fetchAdminRole();
  }, [user]);
  
  // Legacy permission check using the old hasPermission function
  const can = (permission: string): boolean => {
    if (!adminUser) return false;
    
    // Check if user has RBAC permissions
    if (adminUser.permissions && adminUser.permissions.length > 0) {
      // If this is a module-specific permission like 'users.view'
      if (permission.includes('.')) {
        const [module, action] = permission.split('.');
        // Check if module is a valid AdminModule
        const validModule = ['posts', 'users', 'jobs', 'events', 'content', 'team'].includes(module);
        if (validModule) {
          const modulePerm = adminUser.permissions.find(p => p.module === module as AdminModule);
          
          if (modulePerm) {
            switch(action) {
              case 'create': return modulePerm.can_create;
              case 'edit': return modulePerm.can_edit;
              case 'delete': return modulePerm.can_delete;
              case 'view': return modulePerm.can_view;
              default: return false;
            }
          }
        }
        return false;
      }
    }
    
    // Super admin has all permissions (legacy check)
    if (adminUser.role === 'super_admin') return true;
    
    // Legacy permission check
    const hasPermissionResult = legacyHasPermission(adminUser.role, permission);
    console.log(`Checking permission "${permission}" for role "${adminUser.role}": ${hasPermissionResult}`);
    return hasPermissionResult;
  };
  
  // New method to check module-specific permissions
  const hasPermission = (module: AdminModule, action: 'create' | 'edit' | 'delete' | 'view'): boolean => {
    if (!adminUser || !adminUser.permissions) return false;
    
    // Super admin always has all permissions
    if (adminUser.role === 'super_admin' && !adminUser.role_id) return true;
    
    // Check in permissions array
    const permission = adminUser.permissions.find(p => p.module === module);
    
    if (!permission) return false;
    
    switch(action) {
      case 'create': return permission.can_create;
      case 'edit': return permission.can_edit;
      case 'delete': return permission.can_delete;
      case 'view': return permission.can_view;
      default: return false;
    }
  };
  
  return {
    isAdmin,
    adminUser,
    adminRole,
    can,
    hasPermission,
    loading
  };
};

export default useAdminAuth;
