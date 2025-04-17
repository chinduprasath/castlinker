import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Edit, Trash2, Check, Ban, Shield, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User, UserFilters, UserFormData, AdminUserRole } from "@/types/adminTypes";
import UserForm from "@/components/admin/UserForm";
import { formatDistanceToNow } from "date-fns";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useTheme } from "@/contexts/ThemeContext";

const UserManagement = () => {
  const { theme } = useTheme();
  
  // State for users and filters
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: "",
    roleFilter: "all",
    statusFilter: "all"
  });
  
  // Dialog states
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users_management' as any)
        .select('*');
      
      if (error) throw error;
      
      setUsers(data as unknown as User[] || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesRole = filters.roleFilter === "all" || 
      filters.roleFilter === user.role;
    
    const matchesStatus = filters.statusFilter === "all" || 
      filters.statusFilter === user.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handlers for user actions
  const handleAddUser = async (userData: UserFormData) => {
    try {
      const { data, error } = await supabase
        .from('users_management' as any)
        .insert([{
          name: userData.name,
          email: userData.email,
          role: userData.role as AdminUserRole,
          status: userData.status,
          verified: userData.verified,
          avatar_url: userData.avatar_url || null
        }] as any)
        .select();
      
      if (error) throw error;
      
      if (data) {
        setUsers(prev => [...prev, ...(data as unknown as User[])]);
        setShowAddUserDialog(false);
        toast.success("User created successfully!");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to create user. Please try again.");
    }
  };

  const handleEditUser = async (userData: UserFormData) => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('users_management' as any)
        .update({
          name: userData.name,
          email: userData.email,
          role: userData.role as AdminUserRole,
          status: userData.status,
          verified: userData.verified,
          avatar_url: userData.avatar_url || null
        } as any)
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      setUsers(prev => prev.map(user => 
        user.id === currentUser.id ? { ...currentUser, ...userData } as User : user
      ));
      setShowEditUserDialog(false);
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  const handleVerifyUser = async (user: User) => {
    try {
      const { error } = await supabase
        .from('users_management' as any)
        .update({ verified: true } as any)
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, verified: true } : u
      ));
      toast.success(`${user.name} has been verified!`);
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error("Failed to verify user. Please try again.");
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    
    try {
      const { error } = await supabase
        .from('users_management' as any)
        .update({ status: newStatus } as any)
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, status: newStatus as 'active' | 'suspended' | 'pending' } : u
      ));
      toast.success(`User status changed to ${newStatus}!`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status. Please try again.");
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    
    try {
      const { error } = await supabase
        .from('users_management' as any)
        .delete()
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      setUsers(prev => prev.filter(user => user.id !== currentUser.id));
      setShowDeleteDialog(false);
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const { error } = await supabase
        .from('users_management' as any)
        .delete()
        .in('id', selectedUsers);
      
      if (error) throw error;
      
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      toast.success("Selected users deleted successfully!");
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("Failed to delete users. Please try again.");
    }
  };

  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleCheckUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  // Format relative date
  const formatRelativeDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: false });
    } catch {
      return "Unknown";
    }
  };

  // Render status badge based on status
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/30">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/30">Suspended</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/30">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Render verification badge based on verified status
  const renderVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
        <Check className="h-3 w-3 mr-1" /> Verified
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-muted/30">
        Unverified
      </Badge>
    );
  };

  const renderUserRow = (user: User) => {
    return (
      <TableRow key={user.id}>
        <TableCell>
          <Checkbox 
            checked={selectedUsers.includes(user.id)}
            onCheckedChange={(checked) => handleCheckUser(user.id, checked as boolean)}
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 border border-gold/10">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</TableCell>
        <TableCell>{renderStatusBadge(user.status)}</TableCell>
        <TableCell>{renderVerificationBadge(user.verified)}</TableCell>
        <TableCell>{new Date(user.joined_date).toLocaleDateString()}</TableCell>
        <TableCell>{formatRelativeDate(user.last_active)}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-gold"
              onClick={() => {
                setCurrentUser(user);
                setShowEditUserDialog(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            {user.status === 'active' ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-orange-500"
                onClick={() => handleToggleUserStatus(user)}
              >
                <Ban className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-green-500"
                onClick={() => handleToggleUserStatus(user)}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            
            {!user.verified && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-gold"
                onClick={() => handleVerifyUser(user)}
              >
                <Shield className="h-4 w-4" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-red-500"
              onClick={() => {
                setCurrentUser(user);
                setShowDeleteDialog(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold gold-gradient-text">User Management</h1>
        <Button 
          className="bg-gold text-black hover:bg-gold/90"
          onClick={() => setShowAddUserDialog(true)}
        >
          <UserPlus className="h-5 w-5 mr-2" /> Add New User
        </Button>
      </div>

      <Card className="bg-card-gradient backdrop-blur-sm border-gold/10">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts, permissions, and verification status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10 bg-background/50 border-gold/10"
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>
            
            <Select 
              value={filters.roleFilter} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, roleFilter: value }))}
            >
              <SelectTrigger className="w-[180px] bg-background/50 border-gold/10">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="actor">Actor</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="producer">Producer</SelectItem>
                <SelectItem value="writer">Writer</SelectItem>
                <SelectItem value="cinematographer">Cinematographer</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.statusFilter} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, statusFilter: value }))}
            >
              <SelectTrigger className="w-[180px] bg-background/50 border-gold/10">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedUsers.length > 0 && (
            <div className="bg-muted/20 p-2 rounded-md mb-4 flex items-center justify-between">
              <span className="text-sm">{selectedUsers.length} users selected</span>
              <div className="space-x-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
                </Button>
              </div>
            </div>
          )}

          <Tabs defaultValue="all-users" className="w-full">
            <TabsList className="bg-background/20 border border-border/20 mb-6">
              <TabsTrigger value="all-users">All Users</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="pending-verification">Pending Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="all-users" className="mt-0">
              <div className="rounded-md border border-gold/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-background/40">
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={
                            filteredUsers.length > 0 && 
                            selectedUsers.length === filteredUsers.length
                          }
                          onCheckedChange={handleCheckAll}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className={theme === 'dark' ? 'bg-background/20' : 'bg-background/60'}>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map(user => renderUserRow(user))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No users found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="verified" className="mt-0">
              <div className="rounded-md border border-gold/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-background/40">
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={
                            filteredUsers.filter(u => u.verified).length > 0 && 
                            selectedUsers.length === filteredUsers.filter(u => u.verified).length
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers(filteredUsers.filter(u => u.verified).map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className={theme === 'dark' ? 'bg-background/20' : 'bg-background/60'}>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.filter(u => u.verified).length > 0 ? (
                      filteredUsers
                        .filter(u => u.verified)
                        .map(user => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={(checked) => handleCheckUser(user.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8 border border-gold/10">
                                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</TableCell>
                            <TableCell>{renderStatusBadge(user.status)}</TableCell>
                            <TableCell>{new Date(user.joined_date).toLocaleDateString()}</TableCell>
                            <TableCell>{formatRelativeDate(user.last_active)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-gold"
                                  onClick={() => {
                                    setCurrentUser(user);
                                    setShowEditUserDialog(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                  onClick={() => {
                                    setCurrentUser(user);
                                    setShowDeleteDialog(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No verified users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="pending-verification" className="mt-0">
              <div className="rounded-md border border-gold/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-background/40">
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={
                            filteredUsers.filter(u => !u.verified).length > 0 && 
                            selectedUsers.length === filteredUsers.filter(u => !u.verified).length
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers(filteredUsers.filter(u => !u.verified).map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className={theme === 'dark' ? 'bg-background/20' : 'bg-background/60'}>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.filter(u => !u.verified).length > 0 ? (
                      filteredUsers
                        .filter(u => !u.verified)
                        .map(user => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={(checked) => handleCheckUser(user.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8 border border-gold/10">
                                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</TableCell>
                            <TableCell>{renderStatusBadge(user.status)}</TableCell>
                            <TableCell>{new Date(user.joined_date).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20"
                                  onClick={() => handleVerifyUser(user)}
                                >
                                  <Check className="h-4 w-4 mr-1" /> Verify
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                  onClick={() => {
                                    setCurrentUser(user);
                                    setShowDeleteDialog(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No users pending verification found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. Fill in the required information below.
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            onSubmit={handleAddUser}
            onCancel={() => setShowAddUserDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10 sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user account details.
            </DialogDescription>
          </DialogHeader>
          {currentUser && (
            <UserForm 
              initialData={{
                name: currentUser.name,
                email: currentUser.email,
                role: currentUser.role,
                status: currentUser.status,
                verified: currentUser.verified,
                avatar_url: currentUser.avatar_url
              }}
              onSubmit={handleEditUser}
              onCancel={() => setShowEditUserDialog(false)}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <ConfirmDialog 
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteUser}
        title="Confirm User Deletion"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default UserManagement;
