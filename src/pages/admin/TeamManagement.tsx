
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Plus, Search, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminTeamMember } from "@/types/rbacTypes";
import { fetchTeamMembers, updateTeamMemberRole } from "@/services/teamMemberService";
import TeamMemberList from "@/components/admin/team/TeamMemberList";
import RoleManager from "@/components/admin/team/RoleManager";
import AddTeamMemberForm from "@/components/admin/team/AddTeamMemberForm";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const TeamManagement = () => {
  const { adminUser, hasPermission } = useAdminAuth();
  const [teamMembers, setTeamMembers] = useState<AdminTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog states
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showRoleManagerDialog, setShowRoleManagerDialog] = useState(false);
  const [currentMember, setCurrentMember] = useState<AdminTeamMember | null>(null);
  
  // Fetch team members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);
  
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await fetchTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditRole = (member: AdminTeamMember) => {
    setCurrentMember(member);
    setShowRoleManagerDialog(true);
  };
  
  const handleAddMember = () => {
    setShowAddMemberDialog(true);
  };
  
  const onAddMemberSuccess = () => {
    setShowAddMemberDialog(false);
    fetchMembers();
  };
  
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Check permissions
  const canCreateTeamMembers = hasPermission('team', 'create');
  const canEditTeamMembers = hasPermission('team', 'edit');
  const canManageRoles = hasPermission('team', 'edit') && hasPermission('team', 'create');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gold-gradient-text">Team Management</h1>
        
        {canCreateTeamMembers && (
          <Button 
            className="bg-gold text-black hover:bg-gold/90"
            onClick={handleAddMember}
          >
            <UserPlus className="h-5 w-5 mr-2" /> Add Team Member
          </Button>
        )}
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          {canManageRoles && (
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="members" className="pt-4">
          <Card className="bg-card-gradient backdrop-blur-sm border-gold/10">
            <CardHeader className="space-y-1">
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage your administrative team members and their roles</CardDescription>
              
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, email or role..."
                    className="pl-10 bg-background/50 border-gold/10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {canManageRoles && (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRoleManagerDialog(true)}
                    className="whitespace-nowrap"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Roles
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <TeamMemberList 
                teamMembers={filteredMembers}
                loading={loading}
                canEditRoles={canEditTeamMembers}
                onEditRole={handleEditRole}
                onRefresh={fetchMembers}
              />
              
              {/* Add a fixed action button for mobile */}
              {canCreateTeamMembers && (
                <Button 
                  className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-gold text-black hover:bg-gold/90 md:hidden"
                  onClick={handleAddMember}
                >
                  <Plus className="h-6 w-6" />
                  <span className="sr-only">Add Team Member</span>
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {canManageRoles && (
          <TabsContent value="roles" className="pt-4">
            <Card className="bg-card-gradient backdrop-blur-sm border-gold/10">
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>
                  Define roles and assign permissions to control access to different modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoleManager />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Add Team Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Create a new team member account with role-based permissions
            </DialogDescription>
          </DialogHeader>
          
          <AddTeamMemberForm 
            onSuccess={onAddMemberSuccess}
            onCancel={() => setShowAddMemberDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Role Manager Dialog */}
      <Dialog open={showRoleManagerDialog} onOpenChange={setShowRoleManagerDialog} modal={true}>
        <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10 sm:max-w-[900px] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Manage Roles & Permissions</DialogTitle>
            <DialogDescription>
              Create and configure roles with specific permissions for your team members
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RoleManager />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
