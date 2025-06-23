
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission as legacyHasPermission } from '@/lib/adminPermissions';
import { useEffect, useState } from "react";
import { AdminTeamRole } from '@/types/adminTypes';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "@/integrations/firebase/client";
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
          // Check if user is hardcoded admin
          if (user.email === 'admin@gmail.com' && user.role === 'super_admin') {
            console.log("Hardcoded admin user detected");
            setAdminUser({
              id: user.id,
              role: 'super_admin',
              role_id: null,
              name: user.name,
              permissions: [] // Legacy super_admin has all permissions
            });
            setIsAdmin(true);
            setLoading(false);
            return;
          }
          
          // Get admin role from Firestore
          const adminDocRef = doc(db, 'admins', user.id);
          const adminDoc = await getDoc(adminDocRef);
          
          if (adminDoc.exists()) {
            const adminData = adminDoc.data();
            console.log('Admin user found:', adminData);
            
            const role = String(adminData.role).toLowerCase().trim();
            console.log('Role as string:', role);
            
            if (role === 'super_admin') {
              console.log('User is a super_admin');
              
              setAdminUser({
                id: user.id,
                role: 'super_admin',
                role_id: adminData.role_id || null,
                name: user.name,
                permissions: adminData.permissions || []
              });
              setIsAdmin(true);
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
