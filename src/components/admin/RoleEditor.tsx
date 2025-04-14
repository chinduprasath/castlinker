
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Save, Trash, XCircle } from "lucide-react";
import { roles as initialRoles, permissions as allPermissions } from "@/lib/adminPermissions";
import ConfirmDialog from "./ConfirmDialog";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

const RoleEditor = () => {
  // Role states
  const [roles, setRoles] = useState<Role[]>([...initialRoles]);
  const [selectedRole, setSelectedRole] = useState<string>(initialRoles[0].id);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // New role/permission states
  const [showNewRoleForm, setShowNewRoleForm] = useState(false);
  const [newRole, setNewRole] = useState<Omit<Role, 'permissions'> & { permissions: string[] }>({
    id: "",
    name: "",
    description: "",
    permissions: []
  });
  
  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (selectedRole) {
      const role = roles.find(r => r.id === selectedRole);
      if (role) {
        setEditingRole({...role});
      }
    }
  }, [selectedRole, roles]);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (!editingRole) return;

    setEditingRole(prev => {
      if (!prev) return prev;
      
      const hasPermission = prev.permissions.includes(permissionId);
      
      if (hasPermission) {
        return {
          ...prev,
          permissions: prev.permissions.filter(id => id !== permissionId)
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionId]
        };
      }
    });
  };

  const handleSaveRole = () => {
    if (!editingRole) return;
    
    setRoles(prev => 
      prev.map(role => 
        role.id === editingRole.id ? {...editingRole} : role
      )
    );
    toast.success(`Role "${editingRole.name}" updated`);
  };

  const handleAddRole = () => {
    if (!newRole.id || !newRole.name) {
      toast.error("Role ID and name are required");
      return;
    }
    
    if (roles.some(role => role.id === newRole.id)) {
      toast.error(`Role ID "${newRole.id}" already exists`);
      return;
    }
    
    setRoles(prev => [...prev, {...newRole}]);
    setSelectedRole(newRole.id);
    setShowNewRoleForm(false);
    setNewRole({
      id: "",
      name: "",
      description: "",
      permissions: []
    });
    toast.success(`Role "${newRole.name}" created`);
  };

  const confirmDeleteRole = () => {
    if (!roleToDelete) return;
    
    // Don't allow deleting the super_admin role
    if (roleToDelete === 'super_admin') {
      toast.error("The Super Admin role cannot be deleted");
      setShowDeleteConfirm(false);
      setRoleToDelete(null);
      return;
    }
    
    setRoles(prev => prev.filter(role => role.id !== roleToDelete));
    
    if (selectedRole === roleToDelete) {
      setSelectedRole(roles[0].id);
    }
    
    setShowDeleteConfirm(false);
    setRoleToDelete(null);
    toast.success("Role deleted");
  };

  const handleDeleteRole = (roleId: string) => {
    setRoleToDelete(roleId);
    setShowDeleteConfirm(true);
  };

  const groupedPermissions = allPermissions.reduce((groups, permission) => {
    const category = permission.id.split('_')[0];
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles">Edit Roles</TabsTrigger>
          <TabsTrigger value="permissions">Manage Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles">
          <div className="grid grid-cols-12 gap-4">
            {/* Role List */}
            <div className="col-span-12 md:col-span-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Roles</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowNewRoleForm(!showNewRoleForm)}
                  >
                    {showNewRoleForm ? <XCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
                
                {showNewRoleForm && (
                  <Card className="mb-4 border-dashed">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">New Role</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 space-y-3">
                      <div className="grid gap-2">
                        <Label htmlFor="role-id">Role ID</Label>
                        <Input 
                          id="role-id" 
                          value={newRole.id}
                          onChange={(e) => setNewRole({...newRole, id: e.target.value})}
                          placeholder="role_id"
                          className="h-8"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role-name">Role Name</Label>
                        <Input 
                          id="role-name" 
                          value={newRole.name}
                          onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                          placeholder="Role Name"
                          className="h-8"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role-desc">Description</Label>
                        <Textarea 
                          id="role-desc" 
                          value={newRole.description}
                          onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                          placeholder="Role description"
                          className="h-20 min-h-0 resize-none"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button size="sm" onClick={handleAddRole} className="w-full">Add Role</Button>
                    </CardFooter>
                  </Card>
                )}
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className={`p-3 rounded-md border cursor-pointer ${
                        selectedRole === role.id 
                          ? "bg-gold/10 border-gold" 
                          : "hover:bg-muted/30"
                      }`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{role.name}</h4>
                          <p className="text-xs text-muted-foreground">{role.id}</p>
                        </div>
                        {role.id !== 'super_admin' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role.id);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {role.permissions.length} permissions
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Role Editor */}
            <div className="col-span-12 md:col-span-8">
              {editingRole && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit {editingRole.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-name">Role Name</Label>
                        <Input 
                          id="edit-name" 
                          value={editingRole.name}
                          onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                          disabled={editingRole.id === 'super_admin'}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-desc">Description</Label>
                        <Textarea 
                          id="edit-desc" 
                          value={editingRole.description}
                          onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                          rows={2}
                          disabled={editingRole.id === 'super_admin'}
                        />
                      </div>
                      
                      <div className="pt-2">
                        <Label className="text-base">Permissions</Label>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select the permissions for this role
                        </p>
                        
                        <div className="space-y-6">
                          {Object.entries(groupedPermissions).map(([category, perms]) => (
                            <div key={category} className="space-y-2">
                              <h4 className="text-sm font-medium capitalize">{category} Permissions</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {perms.map(permission => (
                                  <div
                                    key={permission.id}
                                    className="flex items-center space-x-2"
                                  >
                                    <Checkbox
                                      id={permission.id}
                                      checked={editingRole.permissions.includes(permission.id)}
                                      onCheckedChange={() => handlePermissionToggle(permission.id)}
                                      disabled={editingRole.id === 'super_admin'}
                                    />
                                    <div className="grid gap-0.5">
                                      <Label
                                        htmlFor={permission.id}
                                        className="text-sm cursor-pointer"
                                      >
                                        {permission.name}
                                      </Label>
                                      <p className="text-xs text-muted-foreground">
                                        {permission.description}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={handleSaveRole}
                      disabled={editingRole.id === 'super_admin'}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>System Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-6">
                These are the system permissions that can be assigned to roles. To change which roles have which permissions, go to the "Edit Roles" tab.
              </div>
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, perms]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-lg font-medium capitalize border-b pb-2">{category} Permissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {perms.map(permission => (
                        <div key={permission.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{permission.name}</h4>
                            <Badge variant="outline" className="font-mono text-xs">
                              {permission.id}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {permission.description}
                          </p>
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Assigned to:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {roles
                                .filter(role => role.permissions.includes(permission.id))
                                .map(role => (
                                  <Badge key={role.id} variant="secondary" className="text-xs">
                                    {role.name}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteRole}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
      />
    </div>
  );
};

export default RoleEditor;
