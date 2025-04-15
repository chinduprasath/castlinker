
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import usePosts from "@/hooks/usePosts";
import PostCard from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Search, X } from "lucide-react";
import CreatePostDialog from "@/components/posts/CreatePostDialog";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

const CATEGORIES = [
  "Audition",
  "Casting Call",
  "Collaboration",
  "Content Creation",
  "Event",
  "Job Opportunity",
  "Mentorship",
  "Other"
];

const Posts = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { user } = useAuth();
  
  const {
    posts,
    loading,
    error,
    appliedPosts,
    likedPosts,
    applicationCounts,
    handleLikePost,
    handleApplyToPost,
    handleDeletePost,
    filters,
    updateFilters,
    clearFilters
  } = usePosts();

  const confirmDeletePost = (postId: string) => {
    setPostToDelete(postId);
  };

  const executeDelete = async () => {
    if (postToDelete) {
      const success = await handleDeletePost(postToDelete);
      if (success) {
        toast({
          title: "Post deleted",
          description: "The post has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete post. Please try again.",
          variant: "destructive"
        });
      }
      setPostToDelete(null);
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-1">
            Find opportunities for auditions, collaborations, and more
          </p>
        </div>
        {user && (
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        )}
      </div>

      <div className="bg-card p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-8"
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            />
          </div>
          
          <Select
            value={filters.category}
            onValueChange={(value) => updateFilters({ category: value })}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {(filters.searchTerm || filters.category !== 'all') && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found.</p>
          {(filters.searchTerm || filters.category !== 'all') && (
            <p className="text-sm mt-2">
              Try adjusting your search filters.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isApplied={!!appliedPosts[post.id]}
              isLiked={!!likedPosts[post.id]}
              applicationCount={applicationCounts[post.id] || 0}
              onApply={handleApplyToPost}
              onLike={handleLikePost}
              onDelete={confirmDeletePost}
            />
          ))}
        </div>
      )}

      <CreatePostDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />

      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Posts;
