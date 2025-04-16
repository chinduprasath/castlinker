
import { supabase } from "@/integrations/supabase/client";
import { AdminPermission, AdminRole, AdminRoleWithPermissions } from "@/types/rbacTypes";

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
    
    // Cast data to correct type
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

export const fetchRoleWithPermissions = async (roleId: string): Promise<AdminRoleWithPermissions> => {
  try {
    // Fetch the role
    const { data: role, error: roleError } = await supabase
      .from('admin_roles')
      .select('*')
      .eq('id', roleId)
      .single();
      
    if (roleError) {
      console.error('Error fetching role:', roleError);
      throw roleError;
    }
    
    // Fetch permissions for the role
    const { data: permissions, error: permError } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('role_id', roleId);
      
    if (permError) {
      console.error('Error fetching permissions:', permError);
      throw permError;
    }
    
    // Map the data to correct types
    const formattedPermissions: AdminPermission[] = (permissions || []).map(p => ({
      id: p.id,
      role_id: p.role_id,
      module: p.module,
      can_create: p.can_create,
      can_edit: p.can_edit,
      can_delete: p.can_delete,
      can_view: p.can_view,
      created_at: p.created_at,
      updated_at: p.updated_at
    }));
    
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      is_system: role.is_system,
      created_at: role.created_at,
      updated_at: role.updated_at,
      permissions: formattedPermissions
    } as AdminRoleWithPermissions;
  } catch (err) {
    console.error('Error in fetchRoleWithPermissions:', err);
    throw err;
  }
};

export const createRole = async (role: Partial<AdminRole>): Promise<AdminRole> => {
  try {
    const { data, error } = await supabase
      .from('admin_roles')
      .insert([role])
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

export const updateRole = async (id: string, role: Partial<AdminRole>): Promise<AdminRole> => {
  try {
    const { data, error } = await supabase
      .from('admin_roles')
      .update(role)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating role:', error);
      throw error;
    }
    
    return data as AdminRole;
  } catch (err) {
    console.error('Error in updateRole:', err);
    throw err;
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('admin_roles')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  } catch (err) {
    console.error('Error in deleteRole:', err);
    throw err;
  }
};

export const updatePermission = async (roleId: string, module: string, permissions: {
  can_create?: boolean;
  can_edit?: boolean;
  can_delete?: boolean;
  can_view?: boolean;
}): Promise<AdminPermission> => {
  try {
    // Check if permission exists
    const { data: existingPerm, error: checkError } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('role_id', roleId)
      .eq('module', module)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error checking permission:', checkError);
      throw checkError;
    }
    
    if (existingPerm) {
      // Update existing permission
      const { data, error } = await supabase
        .from('admin_permissions')
        .update(permissions)
        .eq('id', existingPerm.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating permission:', error);
        throw error;
      }
      
      return data as AdminPermission;
    } else {
      // Insert new permission
      const { data, error } = await supabase
        .from('admin_permissions')
        .insert([{
          role_id: roleId,
          module,
          ...permissions
        }])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating permission:', error);
        throw error;
      }
      
      return data as AdminPermission;
    }
  } catch (err) {
    console.error('Error in updatePermission:', err);
    throw err;
  }
};
