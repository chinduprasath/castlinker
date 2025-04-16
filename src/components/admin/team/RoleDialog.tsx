
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { TeamMember, UserManagementRole } from "@/types/adminTypes";
import { roles, permissions } from "@/lib/adminPermissions";

interface RoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onUpdateRole: (roleId: UserManagementRole) => void;
}

const RoleDialog = ({ isOpen, onClose, member, onUpdateRole }: RoleDialogProps) => {
  if (!member) return null;
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case 'content_manager':
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case 'recruiter':
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case 'moderator':
        return "bg-orange-500/10 text-orange-500 border-orange-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10 sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Update the role and permissions for {member?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid gap-4">
            <Label>Select Role</Label>
            <div className="grid grid-cols-1 gap-4">
              {roles.map(role => (
                <div 
                  key={role.id} 
                  className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${
                    member?.role === role.id 
                      ? 'bg-gold/10 border-gold' 
                      : 'border-border hover:border-gold/50'
                  }`}
                  onClick={() => onUpdateRole(role.id as UserManagementRole)}
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="text-base font-medium">{role.name}</h4>
                      <Badge className={`ml-2 ${getRoleColor(role.id)}`}>
                        {role.permissions.length} permissions
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {role.permissions.slice(0, 3).map(permId => {
                        const perm = permissions.find(p => p.id === permId);
                        return perm ? (
                          <Badge key={perm.id} variant="outline" className="text-xs">
                            {perm.name}
                          </Badge>
                        ) : null;
                      })}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDialog;
