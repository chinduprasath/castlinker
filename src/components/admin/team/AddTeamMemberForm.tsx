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
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const [connectedUsers, setConnectedUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const { user } = useAuth();
  
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
  
  useEffect(() => {
    // Fetch connected users (mutual connections)
    const fetchConnectedUsers = async () => {
      if (!user) return;
      // Find all accepted connections where user is requester or recipient
      const connectionsRef = collection(db, 'connection_requests');
      const q = query(connectionsRef, where('status', '==', 'accepted'));
      const snapshot = await getDocs(q);
      const connections = snapshot.docs.map(doc => doc.data());
      // Get user IDs of connected users
      const connectedIds = connections
        .filter(c => c.requesterId === user.id || c.recipientId === user.id)
        .map(c => (c.requesterId === user.id ? c.recipientId : c.requesterId));
      if (connectedIds.length === 0) return setConnectedUsers([]);
      // Fetch user details
      const usersRef = collection(db, 'users');
      const usersSnap = await getDocs(usersRef);
      const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConnectedUsers(users.filter(u => connectedIds.includes(u.id)));
    };
    fetchConnectedUsers();
  }, [user]);

  // When a user is selected, set name/email
  useEffect(() => {
    if (!selectedUserId) return;
    const selected = connectedUsers.find(u => u.id === selectedUserId);
    if (selected) {
      setName(selected.name || '');
      setEmail(selected.email || '');
    }
  }, [selectedUserId, connectedUsers]);
  
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
        <Label htmlFor="user">Select User</Label>
        <Select value={selectedUserId} onValueChange={setSelectedUserId} required>
          <SelectTrigger id="user" className="w-full">
            <SelectValue placeholder="Select from your connections" />
          </SelectTrigger>
          <SelectContent>
            {connectedUsers.map(u => (
              <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={roleId}
          onValueChange={setRoleId}
          required
        >
          <SelectTrigger id="role" className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {['Acting', 'Director', 'Screenwriter', 'Musician', 'Producer', 'Editor', 'Cinematographer'].map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Member"}
        </Button>
      </div>
    </form>
  );
};

export default AddTeamMemberForm;
