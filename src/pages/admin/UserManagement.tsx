
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, MoreHorizontal, UserCheck, UserX, Shield, Trash2, Mail, Calendar, MapPin, Phone, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  last_login?: string;
  phone?: string;
  location?: string;
  is_active: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  const [blockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, "users_management");
      const querySnapshot = await getDocs(usersCollection);
      const usersData: User[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'N/A',
        email: doc.data().email || 'N/A',
        role: doc.data().role || 'user',
        avatar_url: doc.data().avatar_url,
        last_login: doc.data().last_login,
        phone: doc.data().phone,
        location: doc.data().location,
        is_active: doc.data().is_active !== false // Default to true if not explicitly false
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const userDoc = doc(db, "users_management", userToDelete.id);
      await deleteDoc(userDoc);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      toast({
        title: "User Deleted",
        description: "The user has been successfully deleted."
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const confirmBlock = (user: User) => {
    setUserToBlock(user);
    setBlockConfirmOpen(true);
  };

  const handleBlock = async () => {
    if (!userToBlock) return;

    setIsBlocking(true);
    try {
      const userDoc = doc(db, "users_management", userToBlock.id);
      await updateDoc(userDoc, { is_active: false });
      setUsers(users.map(user =>
        user.id === userToBlock.id ? { ...user, is_active: false } : user
      ));
      setBlockConfirmOpen(false);
      setUserToBlock(null);
      toast({
        title: "User Blocked",
        description: "The user has been successfully blocked."
      });
    } catch (error) {
      console.error("Error blocking user:", error);
      toast({
        title: "Error",
        description: "Failed to block user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblock = async (user: User) => {
    try {
      const userDoc = doc(db, "users_management", user.id);
      await updateDoc(userDoc, { is_active: true });
      setUsers(users.map(u =>
        u.id === user.id ? { ...u, is_active: true } : u
      ));
      toast({
        title: "User Unblocked",
        description: "The user has been successfully unblocked."
      });
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast({
        title: "Error",
        description: "Failed to unblock user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all user accounts in the platform</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50 p-4">
            <CardTitle className="text-xl">Users</CardTitle>
            <CardDescription>
              Total {filteredUsers.length} users
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-32">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarImage src={user.avatar_url} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.is_active ? (
                            <div className="flex items-center text-green-500 gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Active
                            </div>
                          ) : (
                            <div className="flex items-center text-orange-500 gap-1">
                              <UserX className="h-4 w-4" />
                              Blocked
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {user.last_login ? format(new Date(user.last_login), "MMM dd, yyyy") : 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {user.phone || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {user.location || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.is_active ? (
                                <>
                                  <DropdownMenuItem onClick={() => confirmBlock(user)} className="text-orange-500 focus:text-orange-500 cursor-pointer flex items-center">
                                    <UserX className="h-4 w-4 mr-2" />
                                    Block
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => confirmDelete(user)} className="text-destructive focus:text-destructive cursor-pointer flex items-center">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <DropdownMenuItem onClick={() => handleUnblock(user)} className="text-green-500 focus:text-green-500 cursor-pointer flex items-center">
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Unblock
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Confirmation Dialog */}
      <Dialog open={blockConfirmOpen} onOpenChange={setBlockConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Block</DialogTitle>
            <DialogDescription>
              Are you sure you want to block {userToBlock?.name}? This will prevent them from accessing the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBlock} disabled={isBlocking}>
              {isBlocking ? (
                <>
                  Blocking...
                </>
              ) : (
                "Block User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
