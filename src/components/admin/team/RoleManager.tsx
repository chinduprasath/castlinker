
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, PenLine, Trash2 } from "lucide-react";
import { AdminRole } from "@/types/rbacTypes";
import { fetchRoles, createRole, updateRole, deleteRole } from "@/services/adminRoleService";
import ConfirmDialog from "../../admin/ConfirmDialog";
import RolePermissions from "./RolePermissions";

const RoleManager = () => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
  
  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Form states
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleDescription, setEditRoleDescription] = useState("");
  
  useEffect(() => {
    loadRoles();
  }, []);
  
  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await fetchRoles();
      setRoles(data);
      
      // If there are roles but none selected, select the first one
      if (data.length > 0 && !selectedRole) {
        setSelectedRole(data[0]);
      }
    } catch (err) {
      console.error('Error loading roles:', err);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      toast.error("Role name is required");
      return;
    }
    
    try {
      const newRole = await createRole({
        name: newRoleName,
        description: newRoleDescription || null,
        is_system: false
      });
      
      setRoles([...roles, newRole]);
      setSelectedRole(newRole);
      setShowAddDialog(false);
      
      // Reset form
      setNewRoleName("");
      setNewRoleDescription("");
      
      toast.success(`Role "${newRoleName}" created`);
    } catch (err) {
      console.error('Error creating role:', err);
      toast.error("Failed to create role");
    }
  };
  
  const handleEditRole = async () => {
    if (!selectedRole) return;
    if (!editRoleName.trim()) {
      toast.error("Role name is required");
      return;
    }
    
    try {
      const updatedRole = await updateRole(selectedRole.id, {
        name: editRoleName,
        description: editRoleDescription || null
      });
      
      setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));
      setSelectedRole(updatedRole);
      setShowEditDialog(false);
      toast.success(`Role "${editRoleName}" updated`);
    } catch (err) {
      console.error('Error updating role:', err);
      toast.error("Failed to update role");
    }
  };
  
  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    
    try {
      await deleteRole(selectedRole.id);
      
      const updatedRoles = roles.filter(r => r.id !== selectedRole.id);
      setRoles(updatedRoles);
      
      // Select another role if available
      setSelectedRole(updatedRoles.length > 0 ? updatedRoles[0] : null);
      
      setShowDeleteDialog(false);
      toast.success(`Role "${selectedRole.name}" deleted`);
    } catch (err) {
      console.error('Error deleting role:', err);
      toast.error("Failed to delete role");
    }
  };
  
  const openEditDialog = (role: AdminRole) => {
    setEditRoleName(role.name);
    setEditRoleDescription(role.description || "");
    setShowEditDialog(true);
  };
  
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {/* Roles List */}
        <div className="col-span-12 md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Roles</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Role
                </Button>
              </div>
              <CardDescription>
                Define roles for your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                </div>
              ) : roles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No roles defined yet.</p>
                  <p>Click "Add Role" to create your first role.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {roles.map((role) => (
                    <div 
                      key={role.id}
                      className={`p-3 rounded-md border cursor-pointer ${
                        selectedRole?.id === role.id ? "bg-gold/10 border-gold" : "hover:bg-muted/30"
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{role.name}</h3>
                          {role.description && (
                            <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          {!role.is_system && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditDialog(role);
                                }}
                              >
                                <PenLine className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-muted-foreground hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRole(role);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Role Permissions */}
        <div className="col-span-12 md:col-span-8">
          {selectedRole ? (
            <RolePermissions 
              role={selectedRole} 
              onPermissionsChanged={loadRoles}
            />
          ) : (
            <Card className="h-full">
              <CardContent className="flex justify-center items-center h-full">
                <div className="text-center py-16 text-muted-foreground">
                  <p>Select a role to view and edit permissions</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Add Role Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role for your team members
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                placeholder="e.g., Content Manager"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe what this role is responsible for"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddRole}>Create Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Role Name</Label>
              <Input
                id="editName"
                placeholder="e.g., Content Manager"
                value={editRoleName}
                onChange={(e) => setEditRoleName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description (Optional)</Label>
              <Textarea
                id="editDescription"
                placeholder="Describe what this role is responsible for"
                value={editRoleDescription}
                onChange={(e) => setEditRoleDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteRole}
        title="Delete Role"
        description={`Are you sure you want to delete the "${selectedRole?.name}" role? This action cannot be undone.`}
      />
    </>
  );
};

export default RoleManager;
