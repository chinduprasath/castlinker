
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Edit, Trash2, Check, Ban, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock user data
const users = [
  { 
    id: 1, 
    name: "Emma Thompson", 
    email: "emma@castlinker.com", 
    role: "Actor", 
    status: "active", 
    verified: true, 
    joined: "Apr 12, 2023", 
    avatar: "/placeholder.svg", 
    lastActive: "Today" 
  },
  { 
    id: 2, 
    name: "James Wilson", 
    email: "james@castlinker.com", 
    role: "Director", 
    status: "active", 
    verified: true, 
    joined: "May 3, 2023", 
    avatar: "/placeholder.svg", 
    lastActive: "Yesterday" 
  },
  { 
    id: 3, 
    name: "Sophia Chen", 
    email: "sophia@castlinker.com", 
    role: "Producer", 
    status: "active", 
    verified: false, 
    joined: "Jun 18, 2023", 
    avatar: "/placeholder.svg", 
    lastActive: "3 days ago" 
  },
  { 
    id: 4, 
    name: "Michael Rodriguez", 
    email: "michael@castlinker.com", 
    role: "Writer", 
    status: "suspended", 
    verified: false, 
    joined: "Feb 22, 2023", 
    avatar: "/placeholder.svg", 
    lastActive: "1 month ago" 
  },
  { 
    id: 5, 
    name: "Olivia Johnson", 
    email: "olivia@castlinker.com", 
    role: "Actor", 
    status: "active", 
    verified: true, 
    joined: "Jan 5, 2023", 
    avatar: "/placeholder.svg", 
    lastActive: "Today" 
  },
  { 
    id: 6, 
    name: "David Kim", 
    email: "david@castlinker.com", 
    role: "Cinematographer", 
    status: "pending", 
    verified: false, 
    joined: "Jul 10, 2023", 
    avatar: "/placeholder.svg", 
    lastActive: "2 days ago" 
  },
  { 
    id: 7, 
    name: "Talent Studio Inc.", 
    email: "contact@talentstudio.com", 
    role: "Agency", 
    status: "active", 
    verified: true, 
    joined: "Nov 15, 2022", 
    avatar: "/placeholder.svg", 
    lastActive: "Today" 
  },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  // Filtered users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = userType === "all" || 
      (userType === "individual" && user.role !== "Agency") ||
      (userType === "agency" && user.role === "Agency") || 
      (userType === user.role.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || statusFilter === user.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = () => {
    // In a real app, this would call an API to delete the user
    console.log("Delete user with ID:", selectedUser);
    setShowDeleteDialog(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold gold-gradient-text">User Management</h1>
          <Button className="bg-gold text-black hover:bg-gold/90">
            <Plus className="h-5 w-5 mr-2" /> Add New User
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger className="w-[180px] bg-background/50 border-gold/10">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="individual">Individuals</SelectItem>
                  <SelectItem value="agency">Agencies</SelectItem>
                  <SelectItem value="actor">Actors</SelectItem>
                  <SelectItem value="director">Directors</SelectItem>
                  <SelectItem value="producer">Producers</SelectItem>
                  <SelectItem value="writer">Writers</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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

            <Tabs defaultValue="all-users" className="w-full">
              <TabsList className="bg-gold/10 mb-6">
                <TabsTrigger value="all-users">All Users</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="pending-verification">Pending Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="all-users" className="mt-0">
                <div className="rounded-md border border-gold/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-card">
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox />
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
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8 border border-gold/10">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${user.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/30' : ''}
                                  ${user.status === 'suspended' ? 'bg-red-500/10 text-red-500 border-red-500/30' : ''}
                                  ${user.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : ''}
                                `}
                              >
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.verified ? (
                                <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30">
                                  <Check className="h-3 w-3 mr-1" /> Verified
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-muted/30">
                                  Unverified
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{user.joined}</TableCell>
                            <TableCell>{user.lastActive}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-gold">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                {user.status === 'active' ? (
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-orange-500">
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-green-500">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                {!user.verified && (
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-gold">
                                    <Shield className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                <Dialog open={showDeleteDialog && selectedUser === user.id} onOpenChange={(open) => {
                                  setShowDeleteDialog(open);
                                  if (!open) setSelectedUser(null);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                      onClick={() => setSelectedUser(user.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="bg-card-gradient backdrop-blur-sm border-gold/10">
                                    <DialogHeader>
                                      <DialogTitle>Confirm User Deletion</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete this user? This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center space-x-3 p-4 bg-red-500/10 rounded-md border border-red-500/20 my-4">
                                      <Avatar className="h-10 w-10 border border-gold/10">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                      </div>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                        Cancel
                                      </Button>
                                      <Button 
                                        variant="destructive" 
                                        onClick={handleDeleteUser}
                                      >
                                        Delete User
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
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
                    <TableHeader className="bg-card">
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox />
                        </TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.filter(u => u.verified).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8 border border-gold/10">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`
                                ${user.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/30' : ''}
                                ${user.status === 'suspended' ? 'bg-red-500/10 text-red-500 border-red-500/30' : ''}
                                ${user.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : ''}
                              `}
                            >
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell>{user.lastActive}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-gold">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="pending-verification" className="mt-0">
                <div className="rounded-md border border-gold/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-card">
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox />
                        </TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.filter(u => !u.verified).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8 border border-gold/10">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`
                                ${user.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/30' : ''}
                                ${user.status === 'suspended' ? 'bg-red-500/10 text-red-500 border-red-500/30' : ''}
                                ${user.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : ''}
                              `}
                            >
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20"
                              >
                                <Check className="h-4 w-4 mr-1" /> Verify
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20"
                              >
                                <Ban className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
