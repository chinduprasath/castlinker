
import { supabase } from "@/integrations/supabase/client";
import { AdminPermission, AdminRole, AdminRoleWithPermissions, AdminModule } from "@/types/rbacTypes";

export const fetchRoles = async (): Promise<AdminRole[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
    
    return (data || []).map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      is_system: role.is_system,
      created_at: role.created_at,
      updated_at: role.updated_at
    })) as AdminRole[];
  } catch (err) {
    console.error('Error in fetchRoles:', err);
    return [];
  }
};

export const createRole = async (role: {
  name: string;
  description?: string;
}): Promise<AdminRole> => {
  try {
    const { data, error } = await supabase
      .from('admin_roles')
      .insert({
        name: role.name,
        description: role.description || null,
        is_system: false
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating role:', error);
      throw error;
    }
    
    return data as AdminRole;
  } catch (err) {
    console.error('Error in createRole:', err);
    throw err;
  }
};

export const updateRolePermissions = async (
  roleId: string, 
  module: AdminModule, 
  permissions: {
    can_create?: boolean;
    can_edit?: boolean;
    can_delete?: boolean;
    can_view?: boolean;
  }
): Promise<AdminPermission> => {
  try {
    const { data, error } = await supabase
      .from('admin_permissions')
      .upsert({
        role_id: roleId,
        module: module,
        ...permissions
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error updating role permissions:', error);
      throw error;
    }
    
    // Cast the returned data to ensure it matches the AdminPermission type
    const typedData: AdminPermission = {
      id: data.id,
      role_id: data.role_id,
      module: data.module as AdminModule,
      can_create: data.can_create,
      can_edit: data.can_edit,
      can_delete: data.can_delete,
      can_view: data.can_view,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return typedData;
  } catch (err) {
    console.error('Error in updateRolePermissions:', err);
    throw err;
  }
};

export const fetchRoleWithPermissions = async (roleId: string): Promise<AdminRoleWithPermissions | null> => {
  try {
    // First fetch the role details
    const { data: roleData, error: roleError } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('id', roleId)
      .single();
      
    if (roleError) {
      console.error('Error fetching role:', roleError);
      throw roleError;
    }
    
    if (!roleData) return null;
    
    // Then fetch the permissions for this role
    const { data: permissionsData, error: permError } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('role_id', roleId);
      
    if (permError) {
      console.error('Error fetching permissions:', permError);
      throw permError;
    }
    
    // Type-convert the permissions array
    const typedPermissions: AdminPermission[] = (permissionsData || []).map(perm => ({
      id: perm.id,
      role_id: perm.role_id,
      module: perm.module as AdminModule,
      can_create: perm.can_create,
      can_edit: perm.can_edit,
      can_delete: perm.can_delete,
      can_view: perm.can_view,
      created_at: perm.created_at,
      updated_at: perm.updated_at
    }));
    
    // Build the combined object
    const roleWithPermissions: AdminRoleWithPermissions = {
      ...roleData,
      permissions: typedPermissions
    };
    
    return roleWithPermissions;
  } catch (err) {
    console.error('Error in fetchRoleWithPermissions:', err);
    return null;
  }
};
