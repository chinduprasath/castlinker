
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { createRole } from "@/services/adminRoleService";

interface RoleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleCreated?: () => void;
}

const RoleManager: React.FC<RoleManagerProps> = ({ 
  isOpen, 
  onClose, 
  onRoleCreated 
}) => {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const newRole = await createRole({ 
        name: roleName, 
        description: roleDescription 
      });
      
      toast.success(`Role "${newRole.name}" created successfully`);
      onRoleCreated?.();
      onClose();
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to create role");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Define a new administrative role with specific permissions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="roleName" className="block text-sm font-medium">
              Role Name
            </label>
            <Input 
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g., Content Manager"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="roleDescription" className="block text-sm font-medium">
              Description (Optional)
            </label>
            <Input 
              id="roleDescription"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder="Brief description of the role"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateRole} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleManager;
