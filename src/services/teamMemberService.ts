
import { supabase } from "@/integrations/supabase/client";
import { AdminTeamMember } from "@/types/rbacTypes";
import { TeamMember, AdminTeamRole } from "@/types/adminTypes";

export const fetchTeamMembers = async (): Promise<AdminTeamMember[]> => {
  const { data, error } = await supabase
    .from('users_management')
    .select(`
      id,
      name,
      email,
      status,
      joined_date,
      avatar_url,
      admin_roles!inner (
        id,
        name,
        description,
        is_system
      )
    `)
    .order('name');
  
  if (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
  
  // Transform the data to match AdminTeamMember structure
  return (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    role: item.admin_roles,
    role_name: item.admin_roles.name,
    status: item.status,
    joined_date: item.joined_date,
    avatar_url: item.avatar_url
  })) as AdminTeamMember[];
};

export const fetchAllTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase
    .from('users_management')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching all team members:', error);
    throw error;
  }
  
  return data as unknown as TeamMember[];
};

export const updateTeamMemberRole = async (userId: string, roleId: string): Promise<void> => {
  // Use type assertion to handle the admin_role_id property
  const { error } = await supabase
    .from('users_management')
    .update({ admin_role_id: roleId } as any)
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating team member role:', error);
    throw error;
  }
};

export const createTeamMember = async (member: {
  email: string;
  name: string;
  password?: string;
  roleId: string;
  avatar_url?: string;
}): Promise<void> => {
  try {
    // First create the Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: member.email,
      password: member.password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + "!2",
      options: {
        data: {
          name: member.name,
          role_id: member.roleId
        }
      }
    });
    
    if (authError) throw authError;
    
    if (!authData.user) throw new Error("Failed to create user account");
    
    // Create entry in users_management table with type assertion to handle additional properties
    const { error: managementError } = await supabase
      .from('users_management')
      .insert({
        id: authData.user.id,
        name: member.name,
        email: member.email.toLowerCase(),
        // Use 'moderator' as a valid role from AdminTeamRole type instead of 'team_member'
        role: 'moderator' as AdminTeamRole,
        status: 'active',
        verified: true,
        avatar_url: member.avatar_url,
        // Add admin_role_id as part of the type assertion
        admin_role_id: member.roleId
      } as any);
    
    if (managementError) {
      // Try to delete the auth user if the management record failed
      console.error("Error creating team member record:", managementError);
      throw managementError;
    }
  } catch (error) {
    console.error("Error creating team member:", error);
    throw error;
  }
};

export const deleteTeamMember = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('users_management')
    .delete()
    .eq('id', userId);
    
  if (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
  
  // The auth user will remain, but they won't have admin access anymore
};
