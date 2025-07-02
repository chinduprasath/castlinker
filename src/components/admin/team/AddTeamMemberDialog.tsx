import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdminRole } from "@/types/rbacTypes";
import AddTeamMemberForm from "@/components/admin/team/AddTeamMemberForm";

interface AddTeamMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  availableRoles: AdminRole[];
  projectId: string;
  projectName: string;
}

const AddTeamMemberDialog: React.FC<AddTeamMemberDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  availableRoles,
  projectId,
  projectName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add a new team member and assign them a role with specific permissions.
          </DialogDescription>
        </DialogHeader>
        
        <AddTeamMemberForm 
          onSuccess={() => {
            onSuccess?.();
            onClose();
          }}
          onCancel={onClose}
          availableRoles={availableRoles}
          projectId={projectId}
          projectName={projectName}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
