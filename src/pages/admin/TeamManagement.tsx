
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserPlus, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import RoleEditor from "@/components/admin/RoleEditor";
import { TeamMember, AdminTeamRole, AdminUserRole } from "@/types/adminTypes";
import TeamMemberList from "@/components/admin/team/TeamMemberList";
import AddMemberDialog from "@/components/admin/team/AddMemberDialog";
import RoleDialog from "@/components/admin/team/RoleDialog";

// Helper function to convert AdminTeamRole to a database-compatible role
const convertToDBRole = (role: AdminTeamRole): AdminUserRole => {
  // Map admin team roles to database roles
  // For this example, we'll map all admin roles to 'director' for simplicity
  // In a real application, you might want to map these differently
  return 'director';
};

// Helper function to convert database roles back to AdminTeamRole
const convertFromDBRole = (dbRole: string): AdminTeamRole => {
  // Check if the database role is already a valid AdminTeamRole
  if (dbRole === 'super_admin' || dbRole === 'moderator' || 
      dbRole === 'content_manager' || dbRole === 'recruiter') {
    return dbRole as AdminTeamRole;
  }
  // Default fallback role
  return 'moderator';
};

const TeamManagement = () => {
  const { adminUser, can } = useAdminAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showRoleEditorDialog, setShowRoleEditorDialog] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);

  // Fetch team members on component mount
  useEffect(() => {
    fetchTeamMembers();
  }, []);
  
  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users_management')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Process the data to convert DB roles to AdminTeamRoles
      const processedData = (data as any[] || [])
        .filter(user => {
          // Filter to only include what we consider admin team roles
          const role = user.role as string;
          return ['super_admin', 'moderator', 'content_manager', 'recruiter'].includes(role) ||
                 // Include records we can convert to admin roles
                 (role && ['actor', 'director', 'producer', 'writer', 'cinematographer', 'agency'].includes(role));
        })
        .map(user => ({
          ...user,
          // Convert the role from database to our application's AdminTeamRole
          role: convertFromDBRole(user.role as string)
        })) as TeamMember[];
      
      setTeamMembers(processedData);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (newMemberData: any) => {
    try {
      // Convert AdminTeamRole to a database-compatible role
      const dbRole = convertToDBRole(newMemberData.role as AdminTeamRole);
      
      const { data, error } = await supabase
        .from('users_management')
        .insert({
          name: newMemberData.name,
          email: newMemberData.email,
          role: dbRole, // Use the converted role that DB accepts
          verified: true,
          status: 'active'
        })
        .select();
      
      if (error) throw error;
      
      if (data) {
        // Convert roles back for our application
        const newTeamMembers = (data as any[]).map(user => ({
          ...user,
          role: convertFromDBRole(user.role as string)
        })) as TeamMember[];
        
        setTeamMembers(prev => [...prev, ...newTeamMembers]);
        setShowAddMemberDialog(false);
        toast.success("Team member added successfully!");
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    }
  };

  const handleUpdateRole = async (selectedRole: AdminTeamRole) => {
    if (!currentMember) return;
    
    try {
      // Convert AdminTeamRole to a database-compatible role
      const dbRole = convertToDBRole(selectedRole);
      
      const { error } = await supabase
        .from('users_management')
        .update({ role: dbRole }) // Use the converted role
        .eq('id', currentMember.id);
      
      if (error) throw error;
      
      setTeamMembers(prev => prev.map(member => 
        member.id === currentMember.id ? { ...member, role: selectedRole } : member
      ));
      setShowRoleDialog(false);
      toast.success(`${currentMember.name}'s role updated to ${selectedRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const handleEditRole = (member: TeamMember) => {
    setCurrentMember(member);
    setShowRoleDialog(true);
  };

  const canEditRoles = adminUser?.role === 'super_admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gold-gradient-text">Team Management</h1>
        {canEditRoles && (
          <Button 
            className="bg-gold text-black hover:bg-gold/90"
            onClick={() => setShowAddMemberDialog(true)}
          >
            <UserPlus className="h-5 w-5 mr-2" /> Add Team Member
          </Button>
        )}
      </div>

      <Card className="bg-card-gradient backdrop-blur-sm border-gold/10">
        <CardHeader className="space-y-1">
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your admin team and their permissions</CardDescription>
          <div className="flex justify-between items-center mt-4">
            <div className="w-full max-w-sm">
              {/* Search is now in TeamMemberList component */}
            </div>
            {canEditRoles && (
              <Button 
                variant="outline" 
                onClick={() => setShowRoleEditorDialog(true)}
                className="ml-2"
              >
                Edit Roles & Permissions
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <TeamMemberList 
            teamMembers={teamMembers}
            loading={loading}
            canEditRoles={canEditRoles}
            onEditRole={handleEditRole}
          />
          
          {/* Add a fixed action button for mobile */}
          {canEditRoles && (
            <Button 
              className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-gold text-black hover:bg-gold/90 md:hidden"
              onClick={() => setShowAddMemberDialog(true)}
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">Add Team Member</span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Add Team Member Dialog */}
      <AddMemberDialog 
        isOpen={showAddMemberDialog} 
        onClose={() => setShowAddMemberDialog(false)}
        onSubmit={handleAddMember}
      />

      {/* Change Role Dialog */}
      <RoleDialog 
        isOpen={showRoleDialog}
        onClose={() => setShowRoleDialog(false)}
        member={currentMember}
        onUpdateRole={handleUpdateRole}
      />

      {/* Role Editor Dialog */}
      <Dialog open={showRoleEditorDialog} onOpenChange={setShowRoleEditorDialog}>
        <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10 sm:max-w-[800px] max-h-[90vh] overflow-auto">
          <RoleEditor />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
