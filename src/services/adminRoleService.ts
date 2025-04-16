
import { supabase } from "@/integrations/supabase/client";
import { AdminPermission, AdminRole, AdminRoleWithPermissions } from "@/types/rbacTypes";

export const fetchRoles = async (): Promise<AdminRole[]> => {
  const { data, error } = await supabase
    .from('admin_roles')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
  
  return data as AdminRole[];
};

export const fetchRoleWithPermissions = async (roleId: string): Promise<AdminRoleWithPermissions> => {
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
  
  return {
    ...role,
    permissions: permissions as AdminPermission[]
  } as AdminRoleWithPermissions;
};

export const createRole = async (role: Partial<AdminRole>): Promise<AdminRole> => {
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
};

export const updateRole = async (id: string, role: Partial<AdminRole>): Promise<AdminRole> => {
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
};

export const deleteRole = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('admin_roles')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const updatePermission = async (roleId: string, module: string, permissions: {
  can_create?: boolean;
  can_edit?: boolean;
  can_delete?: boolean;
  can_view?: boolean;
}): Promise<AdminPermission> => {
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
};
