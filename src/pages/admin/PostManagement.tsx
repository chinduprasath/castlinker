import { useState, useEffect } from "react";
import { db } from "@/integrations/firebase/client";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Post } from "@/services/postsService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Edit, MoreHorizontal, Search, Trash2, Users, Eye } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import CreatePostModal from '@/components/admin/posts/CreatePostModal';

const PostManagement = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsRef = collection(db, "castlinker_posts");
      const q = query(postsRef, orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedPosts: Post[] = [];
      for (const docSnapshot of querySnapshot.docs) {
        const postData = docSnapshot.data();
        fetchedPosts.push({
          id: docSnapshot.id,
          title: postData.title,
          description: postData.description,
          category: postData.category,
          location: postData.location,
          media_url: postData.media_url,
          media_type: postData.media_type,
          like_count: postData.like_count,
          created_at: postData.created_at.toDate(),
          updated_at: postData.updated_at.toDate(),
        });
      }
      setPosts(fetchedPosts);

      // Get application counts for all posts
      const counts: Record<string, number> = {};
      for (const post of fetchedPosts) {
        const applicationsRef = collection(db, "post_applications");
        const q = query(applicationsRef, where("post_id", "==", post.id));
        const applicationSnapshot = await getDocs(q);
        counts[post.id] = applicationSnapshot.size;
      }
      setApplicationCounts(counts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePostClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreatePostSubmit = (postData: any) => {
    console.log('New post data:', postData);
    // In a real app, send this data to your backend to create the post,
    // then refresh the post list.
    handleCloseCreateModal();
    fetchPosts(); // Refresh the list after creating a post
  };

  const confirmDelete = (post: Post) => {
    setPostToDelete(post);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      await deleteDoc(doc(db, "castlinker_posts", postToDelete.id));
      setPosts(posts.filter(post => post.id !== postToDelete.id));
      setDeleteConfirmOpen(false);
      setPostToDelete(null);
      toast({
        title: "Post Deleted",
        description: "The post has been successfully deleted."
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to generate formatted Post ID
  const generatePostId = (id: string) => {
    if (!id) return 'N/A';
    // Generate a 6-digit code from the UUID
    const numericPart = id.replace(/[^0-9]/g, '').slice(0, 6).padStart(6, '0');
    return `PD-${numericPart}`;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Post Management</h1>
          <p className="text-muted-foreground mt-1">Manage all post listings in the platform</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-8 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleCreatePostClick}>Create Post</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50 p-4">
            <CardTitle className="text-xl">Posts</CardTitle>
            <CardDescription>
              Total {filteredPosts.length} posts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-32">
                        No posts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          <Link to={`/admin/posts/${post.id}`} className="text-gold hover:underline">
                            {generatePostId(post.id)}
                          </Link>
                        </TableCell>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.category}</Badge>
                        </TableCell>
                        <TableCell>{post.location || 'N/A'}</TableCell>
                        <TableCell>{format(new Date(post.created_at), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            {applicationCounts[post.id] || 0}
                          </div>
                        </TableCell>
                        <TableCell>{post.like_count}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log('Edit post:', post.id)} className="cursor-pointer flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => confirmDelete(post)} className="text-destructive focus:text-destructive cursor-pointer flex items-center">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                               {/* Placeholder for Block action */}
                              <DropdownMenuItem onClick={() => console.log('Block post:', post.id)} className="text-orange-500 focus:text-orange-500 cursor-pointer flex items-center">
                                <Eye className="h-4 w-4 mr-2" /> {/* Using Eye temporarily, replace with Block icon if available */}
                                Block
                              </DropdownMenuItem>
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
          <CardFooter className="bg-muted/50 p-4 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredPosts.length} of {posts.length} posts
            </div>
            <Button variant="outline" size="sm" onClick={fetchPosts}>
              Refresh
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the post "{postToDelete?.title}"? This action cannot be undone.
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

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreatePostSubmit}
      />
    </div>
  );
};

export default PostManagement;
