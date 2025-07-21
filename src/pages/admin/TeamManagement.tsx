
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { fetchRoles } from "@/services/adminRoleService";
import { fetchTeamMembers } from "@/services/teamMemberService";
import { AdminRole, AdminTeamMember } from "@/types/rbacTypes";
import TeamMemberList from "@/components/admin/team/TeamMemberList";
import AddTeamMemberDialog from "@/components/admin/team/AddTeamMemberDialog";

const TeamManagement = () => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [teamMembers, setTeamMembers] = useState<AdminTeamMember[]>([]);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, membersData] = await Promise.all([
        fetchRoles(),
        fetchTeamMembers("admin-project") // Using a default project ID for admin context
      ]);
      
      setRoles(rolesData);
      // Handle the case where membersData might be an object with accepted/pending or an array
      if (Array.isArray(membersData)) {
        setTeamMembers(membersData);
      } else if (membersData && typeof membersData === 'object' && 'accepted' in membersData) {
        // If it returns project-specific data, just use the members
        const typedData = membersData as { accepted?: AdminTeamMember[] };
        setTeamMembers(Array.isArray(typedData.accepted) ? typedData.accepted : []);
      } else {
        setTeamMembers([]);
      }
    } catch (error) {
      console.error("Error loading team data:", error);
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddMemberDialog(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" /> Add Team Member
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamMemberList 
            teamMembers={teamMembers} 
            loading={loading}
            roles={roles}
            onRefresh={loadData}
            projectId="admin-project"
          />
        </CardContent>
      </Card>
      
      <AddTeamMemberDialog
        isOpen={showAddMemberDialog}
        onClose={() => setShowAddMemberDialog(false)}
        onSuccess={loadData}
        availableRoles={roles}
        projectId="admin-project"
        projectName="Admin Team"
      />
    </div>
  );
};

export default TeamManagement;
