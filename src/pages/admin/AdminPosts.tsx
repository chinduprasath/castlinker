
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

// Mock post data for demonstration
const mockPosts = [
  {
    id: "1",
    title: "Industry Spotlight: What's Casting in Hollywood This Week",
    status: "published",
    category: "industry",
    author: "Jane Smith",
    date: "2023-06-15T12:00:00Z",
    excerpt: "A roundup of major studio productions that are currently casting actors for upcoming films and TV shows."
  },
  {
    id: "2",
    title: "Actor Showcase: Interview with Rising Star Chris Johnson",
    status: "published",
    category: "interviews",
    author: "Michael Brown",
    date: "2023-06-10T09:30:00Z",
    excerpt: "Chris Johnson talks about his journey from community theater to landing a supporting role in an upcoming Marvel film."
  },
  {
    id: "3",
    title: "5 Tips for Creating a Standout Acting Portfolio",
    status: "draft",
    category: "guides",
    author: "Sarah Williams",
    date: "2023-06-05T14:45:00Z",
    excerpt: "Expert advice on curating your portfolio to catch the attention of casting directors and agents."
  }
];

type PostFormData = {
  title: string;
  content: string;
  category: string;
  status: string;
};

const AdminPosts = () => {
  const { hasPermission } = useAdminAuth();
  const [posts] = useState(mockPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const form = useForm<PostFormData>({
    defaultValues: {
      title: "",
      content: "",
      category: "industry",
      status: "draft"
    }
  });

  const canCreatePosts = hasPermission('posts', 'create');
  const canEditPosts = hasPermission('posts', 'edit');
  const canDeletePosts = hasPermission('posts', 'delete');

  const handleAddPost = (data: PostFormData) => {
    // In a real application, you would call an API to create a post
    console.log("Creating new post:", data);
    toast.success("Post created successfully!");
    setShowAddDialog(false);
    form.reset();
  };

  const handleEditPost = (postId: string) => {
    toast.info(`Editing post with ID: ${postId}`);
  };

  const handleDeletePost = (postId: string) => {
    toast.success(`Post with ID: ${postId} deleted successfully`);
  };

  const handleViewPost = (postId: string) => {
    toast.info(`Viewing post with ID: ${postId}`);
  };

  // Filter posts based on search query and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/10 border-green-500/20 text-green-500";
      case "draft":
        return "bg-amber-500/10 border-amber-500/20 text-amber-500";
      default:
        return "bg-gray-500/10 border-gray-500/20 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gold-gradient-text">Post Management</h1>
          <p className="text-muted-foreground">Create and manage blog posts and content</p>
        </div>
        
        {canCreatePosts && (
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gold text-black hover:bg-gold/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Create a new blog post or article to publish on the platform.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleAddPost)} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Title</label>
                  <Input
                    id="title"
                    placeholder="Enter post title..."
                    {...form.register("title", { required: true })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">Content</label>
                  <Textarea
                    id="content"
                    placeholder="Write your post content here..."
                    rows={6}
                    {...form.register("content", { required: true })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Select
                      onValueChange={(value) => form.setValue("category", value)}
                      defaultValue={form.getValues("category")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="industry">Industry</SelectItem>
                        <SelectItem value="interviews">Interviews</SelectItem>
                        <SelectItem value="guides">Guides</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">Status</label>
                    <Select
                      onValueChange={(value) => form.setValue("status", value)}
                      defaultValue={form.getValues("status")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  <Button type="submit" className="bg-gold text-black hover:bg-gold/90">Create Post</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader className="bg-card/50">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle>Posts</CardTitle>
              <CardDescription>
                Manage your website's blog posts and articles
              </CardDescription>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="w-full pl-8 md:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={filterCategory}
                onValueChange={setFilterCategory}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="industry">Industry</SelectItem>
                  <SelectItem value="interviews">Interviews</SelectItem>
                  <SelectItem value="guides">Guides</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
                <span className="sr-only">Sort posts</span>
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter posts</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-muted/20">
                  <div className="flex-1 mr-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{post.title}</h3>
                      <Badge variant="outline" className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>By {post.author}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleViewPost(post.id)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View post</span>
                    </Button>
                    
                    {canEditPosts && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditPost(post.id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit post</span>
                      </Button>
                    )}
                    
                    {canDeletePosts && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete post</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <p>No posts found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 bg-card/50">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing <strong>{filteredPosts.length}</strong> of <strong>{posts.length}</strong> posts
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminPosts;
