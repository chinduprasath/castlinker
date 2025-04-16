
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createTeamMember } from "@/services/teamMemberService";
import { AdminRole } from "@/types/rbacTypes";

interface AddTeamMemberFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
  availableRoles: AdminRole[];
}

const DEFAULT_ROLES = [
  { id: "super_admin", name: "Super Admin" },
  { id: "admin", name: "Admin" },
  { id: "manager", name: "Manager" },
  { id: "editor", name: "Editor" },
  { id: "reviewer", name: "Reviewer" },
  { id: "hr", name: "HR" },
];

const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({ 
  onSuccess, 
  onCancel,
  availableRoles 
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [generatePassword, setGeneratePassword] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [displayRoles, setDisplayRoles] = useState<AdminRole[]>([]);
  
  // Merge database roles with default roles if needed
  useEffect(() => {
    // Start with the available roles from the database
    let roles = [...availableRoles];
    
    // If there are no roles or fewer than the default set, use the default roles
    if (roles.length < DEFAULT_ROLES.length) {
      // Create a map of existing role names to avoid duplicates
      const existingRoleNames = new Set(roles.map(r => r.name.toLowerCase()));
      
      // Add default roles that don't exist in the database
      DEFAULT_ROLES.forEach(defaultRole => {
        if (!existingRoleNames.has(defaultRole.name.toLowerCase())) {
          roles.push({
            id: defaultRole.id,
            name: defaultRole.name,
            description: null,
            is_system: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      });
    }
    
    setDisplayRoles(roles);
    
    // Set default role to the first non-SuperAdmin role if available
    if (roles.length > 0) {
      const defaultRole = roles.find(r => r.name.toLowerCase() !== 'super admin') || roles[0];
      if (defaultRole) {
        setRoleId(defaultRole.id);
      }
    }
  }, [availableRoles]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !roleId) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!generatePassword && (!password || password.length < 8)) {
      toast.error("Please provide a password (min 8 characters)");
      return;
    }
    
    try {
      setSubmitting(true);
      
      await createTeamMember({
        name,
        email,
        password: generatePassword ? undefined : password,
        roleId
      });
      
      toast.success(`Team member ${name} created successfully`);
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error creating team member:', err);
      toast.error(err.message || "Failed to create team member");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={roleId}
          onValueChange={setRoleId}
          disabled={displayRoles.length === 0}
        >
          <SelectTrigger id="role" className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {displayRoles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="generatePassword"
            checked={generatePassword}
            onChange={(e) => setGeneratePassword(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="generatePassword">Generate random password</Label>
        </div>
      </div>
      
      {!generatePassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Team Member"}
        </Button>
      </div>
    </form>
  );
};

export default AddTeamMemberForm;
