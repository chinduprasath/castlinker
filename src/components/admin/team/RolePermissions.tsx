
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import { AdminModule, AdminPermission, AdminRoleWithPermissions } from "@/types/rbacTypes";
import { updateRolePermissions, fetchRoleWithPermissions } from "@/services/adminRoleService";

interface RolePermissionsProps {
  roleId: string;
  onUpdate?: () => void;
}

const ModuleLabels: Record<AdminModule, string> = {
  posts: "Blog Posts",
  users: "User Management",
  jobs: "Job Listings",
  events: "Events",
  content: "Content",
  team: "Team Management"
};

const RolePermissions: React.FC<RolePermissionsProps> = ({ roleId, onUpdate }) => {
  const [role, setRole] = useState<AdminRoleWithPermissions | null>(null);
  const [permissions, setPermissions] = useState<Record<string, AdminPermission>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Available modules for permissions
  const modules: AdminModule[] = ["posts", "users", "jobs", "events", "content", "team"];
  
  useEffect(() => {
    if (!roleId) return;
    loadRolePermissions();
  }, [roleId]);
  
  const loadRolePermissions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const roleData = await fetchRoleWithPermissions(roleId);
      
      if (!roleData) {
        setError("Role not found");
        return;
      }
      
      setRole(roleData);
      
      // Convert permissions array to a lookup object
      const permMap: Record<string, AdminPermission> = {};
      roleData.permissions.forEach(perm => {
        permMap[perm.module] = perm;
      });
      
      setPermissions(permMap);
    } catch (err) {
      console.error("Error loading role permissions:", err);
      setError("Failed to load role permissions");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePermissionChange = async (
    module: AdminModule,
    permission: "can_create" | "can_edit" | "can_delete" | "can_view",
    value: boolean
  ) => {
    if (!roleId) return;
    
    // Create a copy of the current permission
    const updatedPerm = { 
      ...(permissions[module] || { 
        role_id: roleId,
        module,
        can_create: false,
        can_edit: false,
        can_delete: false,
        can_view: false
      })
    };
    
    // Update the specific permission
    updatedPerm[permission] = value;
    
    // Save to Supabase
    try {
      setSaving(module);
      
      // Extract the necessary fields to update
      const permToUpdate = {
        can_create: updatedPerm.can_create,
        can_edit: updatedPerm.can_edit,
        can_delete: updatedPerm.can_delete,
        can_view: updatedPerm.can_view
      };
      
      const updatedPermission = await updateRolePermissions(
        roleId,
        module,
        permToUpdate
      );
      
      // Update local state
      setPermissions(prev => ({
        ...prev,
        [module]: updatedPermission
      }));
      
      // Show success toast
      toast.success(`Updated ${ModuleLabels[module]} permissions`);
      
      // Call onUpdate callback if provided
      if (onUpdate) onUpdate();
      
    } catch (err) {
      console.error(`Error updating ${module} permission:`, err);
      toast.error(`Failed to update ${ModuleLabels[module]} permissions`);
    } finally {
      setSaving(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !role) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
        <AlertCircle className="text-red-500 mr-2" />
        <p className="text-red-700">{error || "Could not load role"}</p>
      </div>
    );
  }
  
  if (role.is_system && role.name === "SuperAdmin") {
    return (
      <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
        <Info className="text-muted-foreground h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium">System Role Permissions</h4>
          <p className="text-muted-foreground text-sm mt-1">
            The SuperAdmin role has all permissions by default and cannot be modified.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-lg font-semibold">{role.name}</h3>
        {role.description && (
          <p className="text-muted-foreground">{role.description}</p>
        )}
        {role.is_system && (
          <Badge variant="outline" className="w-fit mt-1">System Role</Badge>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map(module => (
          <Card key={module}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{ModuleLabels[module]}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['can_view', 'can_create', 'can_edit', 'can_delete'].map(perm => (
                  <div key={`${module}-${perm}`} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`${module}-${perm}`} 
                      checked={permissions[module]?.[perm as keyof AdminPermission] || false}
                      onCheckedChange={(checked) => {
                        handlePermissionChange(
                          module, 
                          perm as "can_create" | "can_edit" | "can_delete" | "can_view", 
                          checked === true
                        );
                      }}
                      disabled={saving === module}
                    />
                    <label 
                      htmlFor={`${module}-${perm}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {perm.replace('can_', '').charAt(0).toUpperCase() + perm.replace('can_', '').slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RolePermissions;
