
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Shield, Trash2, UserCog } from "lucide-react";
import { AdminTeamMember, AdminRole } from "@/types/rbacTypes";
import { fetchRoles } from "@/services/adminRoleService";
import { updateTeamMemberRole, deleteTeamMember } from "@/services/teamMemberService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ConfirmDialog from "../ConfirmDialog";
import { useEffect } from "react";

interface TeamMemberListProps {
  teamMembers: AdminTeamMember[];
  loading: boolean;
  roles?: AdminRole[];
  onRefresh?: () => void;
  canEditRoles?: boolean;
  projectId?: string;
}

const TeamMemberList = ({ 
  teamMembers, 
  loading, 
  roles: initialRoles,
  onRefresh,
  canEditRoles = true,
  projectId = "admin-project"
}: TeamMemberListProps) => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [showChangeRoleDialog, setShowChangeRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<AdminTeamMember | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRoles && initialRoles.length > 0) {
      setRoles(initialRoles);
    } else {
      loadRoles();
    }
  }, [initialRoles]);

  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      console.error('Error loading roles:', err);
    } finally {
      setRolesLoading(false);
    }
  };

  const handleOpenRoleDialog = (member: AdminTeamMember) => {
    setSelectedMember(member);
    setSelectedRoleId(member.role?.id || "");
    setShowChangeRoleDialog(true);
  };
  
  const handleOpenDeleteDialog = (member: AdminTeamMember) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };
  
  const handleChangeRole = async () => {
    if (!selectedMember || !selectedRoleId) return;
    
    try {
      setIsSubmitting(true);
      await updateTeamMemberRole(projectId, selectedMember.id, selectedRoleId);
      toast.success(`${selectedMember.name}'s role has been updated`);
      setShowChangeRoleDialog(false);
      
      // Refresh the list
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error updating role:', err);
      toast.error("Failed to update role");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    
    try {
      setIsSubmitting(true);
      await deleteTeamMember(projectId, selectedMember.id);
      toast.success(`${selectedMember.name} has been removed from the team`);
      setShowDeleteDialog(false);
      
      // Refresh the list
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error deleting team member:', err);
      toast.error("Failed to delete team member");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format relative date
  const formatRelativeDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }
  
  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium">No Team Members Found</h3>
        <p className="mt-1">Add team members to help manage your platform</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-card">
            <TableRow>
              <TableHead>Team Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage 
                        src={member.avatar_url} 
                        alt={member.name} 
                      />
                      <AvatarFallback>{member.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={member.role_name === "SuperAdmin" ? "bg-gold/10 text-gold" : undefined}
                  >
                    {member.role_name}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {member.email}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {formatRelativeDate(member.joined_date)}
                </TableCell>
                <TableCell>
                  {canEditRoles && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenRoleDialog(member)}>
                          <UserCog className="h-4 w-4 mr-2" /> Change Role
                        </DropdownMenuItem>
                        {/* Only allow deletion of non-SuperAdmin users */}
                        {member.role_name !== "SuperAdmin" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleOpenDeleteDialog(member)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Remove
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Change Role Dialog */}
      <Dialog open={showChangeRoleDialog} onOpenChange={setShowChangeRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>
              Change role and permissions for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Current Role</div>
                <Badge variant="outline" className="text-sm">
                  {selectedMember?.role_name}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">New Role</label>
                <Select
                  value={selectedRoleId}
                  onValueChange={setSelectedRoleId}
                  disabled={rolesLoading || isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowChangeRoleDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleChangeRole}
                  disabled={!selectedRoleId || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Change Role"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteMember}
        title="Remove Team Member"
        description={`Are you sure you want to remove ${selectedMember?.name} from the team? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default TeamMemberList;
