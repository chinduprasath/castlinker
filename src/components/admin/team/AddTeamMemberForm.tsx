
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
import { fetchRoles } from "@/services/adminRoleService";
import { createTeamMember } from "@/services/teamMemberService";
import { AdminRole } from "@/types/rbacTypes";

interface AddTeamMemberFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [generatePassword, setGeneratePassword] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setRolesLoading(true);
        const data = await fetchRoles();
        setRoles(data);
        
        // Set default role to the first non-SuperAdmin role if available
        const defaultRole = data.find(r => r.name !== 'SuperAdmin') || data[0];
        if (defaultRole) {
          setRoleId(defaultRole.id);
        }
      } catch (err) {
        console.error('Error loading roles:', err);
        toast.error("Failed to load roles");
      } finally {
        setRolesLoading(false);
      }
    };
    
    loadRoles();
  }, []);
  
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
          disabled={rolesLoading}
        >
          <SelectTrigger id="role" className="w-full">
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
        <Button type="submit" disabled={submitting || rolesLoading}>
          {submitting ? "Creating..." : "Create Team Member"}
        </Button>
      </div>
    </form>
  );
};

export default AddTeamMemberForm;
