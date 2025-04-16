
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { AdminModule, AdminPermission, AdminRole } from "@/types/rbacTypes";
import { updatePermission, fetchRoleWithPermissions } from "@/services/adminRoleService";

interface RolePermissionsProps {
  role: AdminRole;
  onPermissionsChanged?: () => void;
}

const moduleLabels: Record<AdminModule, string> = {
  posts: "Posts Management",
  users: "User Management",
  jobs: "Jobs Management",
  events: "Events Management",
  content: "Content Management",
  team: "Team Management"
};

const RolePermissions = ({ role, onPermissionsChanged }: RolePermissionsProps) => {
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const modules: AdminModule[] = ['posts', 'users', 'jobs', 'events', 'content', 'team'];
  
  useEffect(() => {
    const loadPermissions = async () => {
      if (!role?.id) return;
      
      try {
        setLoading(true);
        const roleWithPerms = await fetchRoleWithPermissions(role.id);
        setPermissions(roleWithPerms.permissions);
      } catch (err) {
        console.error('Error loading permissions:', err);
        toast.error("Failed to load permissions");
      } finally {
        setLoading(false);
      }
    };
    
    loadPermissions();
  }, [role]);
  
  const getPermissionForModule = (module: string): AdminPermission | undefined => {
    return permissions.find(p => p.module === module);
  };
  
  const handlePermissionChange = async (module: AdminModule, action: 'can_create' | 'can_edit' | 'can_delete' | 'can_view', value: boolean) => {
    if (!role?.id) return;
    
    try {
      // Update local state first for immediate feedback
      const updatedPermissions = permissions.map(p => {
        if (p.module === module) {
          return { ...p, [action]: value };
        }
        return p;
      });
      
      // If the permission doesn't exist yet, create it
      if (!updatedPermissions.some(p => p.module === module)) {
        const newPerm: AdminPermission = {
          id: '',  // Will be assigned by the backend
          role_id: role.id,
          module,
          can_create: action === 'can_create' ? value : false,
          can_edit: action === 'can_edit' ? value : false,
          can_delete: action === 'can_delete' ? value : false,
          can_view: action === 'can_view' ? value : false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        updatedPermissions.push(newPerm);
      }
      
      setPermissions(updatedPermissions);
      
      // Then send to backend
      await updatePermission(role.id, module, { [action]: value });
      
      // Notify parent if needed
      if (onPermissionsChanged) {
        onPermissionsChanged();
      }
    } catch (err) {
      console.error(`Error updating ${action} permission for ${module}:`, err);
      toast.error(`Failed to update permission`);
      
      // Revert the local state change
      const roleWithPerms = await fetchRoleWithPermissions(role.id);
      setPermissions(roleWithPerms.permissions);
    }
  };
  
  const handleSaveAll = async () => {
    if (!role?.id) return;
    
    try {
      setSaving(true);
      
      // Save each module's permissions
      for (const module of modules) {
        const perm = getPermissionForModule(module);
        
        // If permission exists in our local state
        if (perm) {
          await updatePermission(role.id, module, {
            can_create: perm.can_create,
            can_edit: perm.can_edit,
            can_delete: perm.can_delete,
            can_view: perm.can_view
          });
        }
      }
      
      toast.success("All permissions saved successfully");
      
      // Notify parent if needed
      if (onPermissionsChanged) {
        onPermissionsChanged();
      }
    } catch (err) {
      console.error('Error saving all permissions:', err);
      toast.error("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading permissions...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">
          Permissions for {role?.name || 'Selected Role'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {role?.is_system && role.name === 'SuperAdmin' && (
            <div className="bg-gold/10 p-4 rounded-md border border-gold/20">
              <p className="text-sm text-gold">
                Super Admins always have full permissions to all modules and cannot be restricted.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-7 gap-4 pb-2 border-b">
            <div className="col-span-3">
              <Label className="text-sm font-bold">Module</Label>
            </div>
            <div className="text-center">
              <Label className="text-sm font-bold">View</Label>
            </div>
            <div className="text-center">
              <Label className="text-sm font-bold">Create</Label>
            </div>
            <div className="text-center">
              <Label className="text-sm font-bold">Edit</Label>
            </div>
            <div className="text-center">
              <Label className="text-sm font-bold">Delete</Label>
            </div>
          </div>
          
          {modules.map((module) => {
            const perm = getPermissionForModule(module);
            const isDisabled = role?.is_system && role.name === 'SuperAdmin';
            
            return (
              <div key={module} className="grid grid-cols-7 gap-4 items-center py-2 border-b border-gray-100 dark:border-gray-800">
                <div className="col-span-3">
                  <Label className="text-base font-medium">{moduleLabels[module]}</Label>
                </div>
                <div className="flex justify-center">
                  <Checkbox
                    checked={perm?.can_view ?? false}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => {
                      handlePermissionChange(module, 'can_view', !!checked);
                    }}
                  />
                </div>
                <div className="flex justify-center">
                  <Checkbox
                    checked={perm?.can_create ?? false}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => {
                      handlePermissionChange(module, 'can_create', !!checked);
                    }}
                  />
                </div>
                <div className="flex justify-center">
                  <Checkbox
                    checked={perm?.can_edit ?? false}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => {
                      handlePermissionChange(module, 'can_edit', !!checked);
                    }}
                  />
                </div>
                <div className="flex justify-center">
                  <Checkbox
                    checked={perm?.can_delete ?? false}
                    disabled={isDisabled}
                    onCheckedChange={(checked) => {
                      handlePermissionChange(module, 'can_delete', !!checked);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSaveAll}
          disabled={saving || (role?.is_system && role.name === 'SuperAdmin')}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save All Permissions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RolePermissions;
