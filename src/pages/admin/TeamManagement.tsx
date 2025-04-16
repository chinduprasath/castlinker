
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { fetchRoles } from "@/services/adminRoleService";
import { fetchTeamMembers } from "@/services/teamMemberService";
import { AdminRole, AdminTeamMember } from "@/types/rbacTypes";
import RoleManager from "@/components/admin/team/RoleManager";
import TeamMemberList from "@/components/admin/team/TeamMemberList";

const TeamManagement = () => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [teamMembers, setTeamMembers] = useState<AdminTeamMember[]>([]);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, membersData] = await Promise.all([
        fetchRoles(),
        fetchTeamMembers()
      ]);
      
      setRoles(rolesData);
      setTeamMembers(membersData);
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
        <Button 
          onClick={() => setShowRoleDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Create Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Display roles or roles management UI */}
          {roles.map(role => (
            <div key={role.id} className="p-2 border-b">
              {role.name} - {role.description}
            </div>
          ))}
        </CardContent>
      </Card>

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
          />
        </CardContent>
      </Card>

      <RoleManager 
        isOpen={showRoleDialog}
        onClose={() => setShowRoleDialog(false)}
        onRoleCreated={loadData}
      />
    </div>
  );
};

export default TeamManagement;
