
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { roles, permissions } from "@/lib/adminPermissions";

interface NewMemberData {
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewMemberData) => Promise<void>;
}

const AddMemberDialog = ({ isOpen, onClose, onSubmit }: AddMemberDialogProps) => {
  const [newMemberData, setNewMemberData] = useState<NewMemberData>({
    name: "",
    email: "",
    role: "moderator",
    permissions: []
  });

  const handlePermissionToggle = (permissionId: string) => {
    setNewMemberData(prev => {
      const currentPermissions = prev.permissions;
      const isCurrentlySelected = currentPermissions.includes(permissionId);
      
      return {
        ...prev,
        permissions: isCurrentlySelected
          ? currentPermissions.filter(p => p !== permissionId)
          : [...currentPermissions, permissionId]
      };
    });
  };

  const handleSubmit = async () => {
    await onSubmit(newMemberData);
    // Reset form
    setNewMemberData({ 
      name: "", 
      email: "", 
      role: "moderator", 
      permissions: [] 
    });
  };

  const handleRoleChange = (value: string) => {
    setNewMemberData({
      ...newMemberData,
      role: value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10 sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Create a new team member with specific roles and permissions
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              placeholder="Enter full name" 
              value={newMemberData.name}
              onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})}
              className="bg-background/50 border-gold/10"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="Enter email address" 
              value={newMemberData.email}
              onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})}
              className="bg-background/50 border-gold/10"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Role</Label>
            <Select 
              value={newMemberData.role}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="bg-background/50 border-gold/10">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2 mt-4">
            <Label>Specific Permissions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {permissions.map(permission => (
                <div 
                  key={permission.id} 
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={permission.id}
                    checked={newMemberData.permissions.includes(permission.id)}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                  />
                  <Label htmlFor={permission.id} className="text-sm">
                    {permission.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!newMemberData.name || !newMemberData.email}
          >
            Add Team Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
