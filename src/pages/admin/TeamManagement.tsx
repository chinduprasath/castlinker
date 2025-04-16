
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import RoleEditor from "@/components/admin/RoleEditor";
import { TeamMember } from "@/types/adminTypes";
import TeamMemberList from "@/components/admin/team/TeamMemberList";
import AddMemberDialog from "@/components/admin/team/AddMemberDialog";
import RoleDialog from "@/components/admin/team/RoleDialog";

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
      
      // Now typing as TeamMember[] directly since role is string
      const typedData = data as TeamMember[] || [];
      
      setTeamMembers(typedData);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (newMemberData: any) => {
    try {
      // Store the role as a plain string
      const roleValue = newMemberData.role;
      
      const { data, error } = await supabase
        .from('users_management')
        .insert({
          name: newMemberData.name,
          email: newMemberData.email,
          role: roleValue as string, // Cast as string to ensure type compatibility
          verified: true,
          status: 'active'
        })
        .select();
      
      if (error) throw error;
      
      if (data) {
        // Now typing as TeamMember[] since role is string
        const typedData = data as TeamMember[];
        
        setTeamMembers(prev => [...prev, ...typedData]);
        setShowAddMemberDialog(false);
        toast.success("Team member added successfully!");
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    }
  };

  const handleUpdateRole = async (selectedRole: string) => {
    if (!currentMember) return;
    
    try {
      const { error } = await supabase
        .from('users_management')
        .update({ role: selectedRole })
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
