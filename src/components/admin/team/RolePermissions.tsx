
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AdminModule, AdminPermission } from "@/types/rbacTypes";
import { updateRolePermissions } from "@/services/adminRoleService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface RolePermissionsProps {
  roleId: string;
  permissions: AdminPermission[];
  onPermissionsUpdated?: () => void;
}

interface PermissionModule {
  name: AdminModule;
  label: string;
  description: string;
}

// Define the modules with their labels and descriptions
const permissionModules: PermissionModule[] = [
  {
    name: "posts",
    label: "Posts & Content",
    description: "Manage blog posts, articles and content"
  },
  {
    name: "users",
    label: "Users Management",
    description: "Manage platform users and profiles"
  },
  {
    name: "jobs",
    label: "Jobs & Listings",
    description: "Manage job postings and applications"
  },
  {
    name: "events",
    label: "Events",
    description: "Manage events and calendar items"
  },
  {
    name: "content",
    label: "Media & Resources",
    description: "Manage uploaded files and resources"
  },
  {
    name: "team",
    label: "Team Management",
    description: "Manage team members and roles"
  }
];

const RolePermissions = ({ roleId, permissions = [], onPermissionsUpdated }: RolePermissionsProps) => {
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [permissionsState, setPermissionsState] = useState<Map<string, AdminPermission>>(new Map());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Initialize permissions state from props
  useEffect(() => {
    const permMap = new Map<string, AdminPermission>();
    
    // Add existing permissions to the map
    permissions.forEach(perm => {
      permMap.set(perm.module, perm);
    });
    
    // Ensure all modules have an entry with default values
    permissionModules.forEach(module => {
      if (!permMap.has(module.name)) {
        permMap.set(module.name, {
          id: "",
          role_id: roleId,
          module: module.name,
          can_create: false,
          can_edit: false,
          can_delete: false,
          can_view: false,
          created_at: "",
          updated_at: ""
        });
      }
    });
    
    setPermissionsState(permMap);
  }, [roleId, permissions]);
  
  const getPermission = (module: AdminModule): AdminPermission => {
    return permissionsState.get(module) || {
      id: "",
      role_id: roleId,
      module,
      can_create: false,
      can_edit: false,
      can_delete: false,
      can_view: false,
      created_at: "",
      updated_at: ""
    };
  };
  
  const handlePermissionChange = (
    module: AdminModule,
    permission: 'can_create' | 'can_edit' | 'can_delete' | 'can_view',
    checked: boolean
  ) => {
    const currentPerm = getPermission(module);
    const updatedPerm: AdminPermission = {
      ...currentPerm,
      [permission]: checked
    };
    
    const newState = new Map(permissionsState);
    newState.set(module, updatedPerm);
    setPermissionsState(newState);
  };
  
  const handleSavePermissions = async (module: AdminModule) => {
    try {
      setIsSaving(true);
      const permission = getPermission(module);
      
      await updateRolePermissions(
        roleId,
        module,
        {
          can_create: permission.can_create,
          can_edit: permission.can_edit,
          can_delete: permission.can_delete,
          can_view: permission.can_view
        }
      );
      
      toast.success(`Permissions for ${module} updated successfully`);
      
      if (onPermissionsUpdated) {
        onPermissionsUpdated();
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Failed to update permissions");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            {permissionModules.map(module => (
              <TabsTrigger 
                key={module.name}
                value={module.name}
                className="text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-2"
              >
                {module.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {permissionModules.map(module => (
            <TabsContent key={module.name} value={module.name} className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                {module.description}
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${module.name}-view`}
                    checked={getPermission(module.name).can_view}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(module.name, 'can_view', checked === true)
                    }
                  />
                  <Label htmlFor={`${module.name}-view`}>View</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${module.name}-create`}
                    checked={getPermission(module.name).can_create}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(module.name, 'can_create', checked === true)
                    }
                  />
                  <Label htmlFor={`${module.name}-create`}>Create</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${module.name}-edit`}
                    checked={getPermission(module.name).can_edit}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(module.name, 'can_edit', checked === true)
                    }
                  />
                  <Label htmlFor={`${module.name}-edit`}>Edit</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${module.name}-delete`}
                    checked={getPermission(module.name).can_delete}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(module.name, 'can_delete', checked === true)
                    }
                  />
                  <Label htmlFor={`${module.name}-delete`}>Delete</Label>
                </div>
              </div>
              
              <Button 
                onClick={() => handleSavePermissions(module.name)} 
                disabled={isSaving}
                className="mt-4"
              >
                {isSaving ? "Saving..." : "Save Permissions"}
              </Button>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RolePermissions;
