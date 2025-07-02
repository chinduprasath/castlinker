import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import usePosts from "@/hooks/usePosts";
import PostCard from "@/components/posts/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { format, isBefore, isAfter } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Loader2,
  Plus,
  Search,
  X,
  Calendar as CalendarIcon,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CreatePostDialog from "@/components/posts/CreatePostDialog";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

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

const LOCATIONS = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Any Location"
];

const ITEMS_PER_PAGE = 9; // For 3x3 grid

const Posts = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [postDateRange, setPostDateRange] = useState<DateRange | undefined>();
  const [deadlineDateRange, setDeadlineDateRange] = useState<DateRange | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  
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
    clearFilters,
    refreshPosts
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

  const handleViewDetails = (post) => {
    setSelectedPost(post);
  };

  const handleCreatePostSubmit = async (postData: any) => {
    setShowCreateDialog(false);
    await refreshPosts();
    toast({
      title: 'Post published',
      description: 'Your post has been published and is now visible.',
    });
  };

  const filteredPosts = posts.filter(post => {
    if (filters.category !== 'all' && post.category !== filters.category) {
      return false;
    }
    
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        (post.title?.toLowerCase().includes(searchTerm)) || 
        (post.description?.toLowerCase().includes(searchTerm)) ||
        (Array.isArray(post.tags) && post.tags.some(tag => 
          tag?.toLowerCase().includes(searchTerm)
        ));
      
      if (!matchesSearch) return false;
    }
    
    if (selectedLocation && selectedLocation !== "Any Location") {
      if (!post.location || !post.location.includes(selectedLocation)) {
        return false;
      }
    }
    
    if (postDateRange?.from) {
      const postDate = new Date(post.created_at);
      if (isBefore(postDate, postDateRange.from)) {
        return false;
      }
    }
    
    if (postDateRange?.to) {
      const postDate = new Date(post.created_at);
      if (isAfter(postDate, postDateRange.to)) {
        return false;
      }
    }
    
    if (deadlineDateRange?.from && post.event_date) {
      const eventDate = new Date(post.event_date);
      if (isBefore(eventDate, deadlineDateRange.from)) {
        return false;
      }
    }
    
    if (deadlineDateRange?.to && post.event_date) {
      const eventDate = new Date(post.event_date);
      if (isAfter(eventDate, deadlineDateRange.to)) {
        return false;
      }
    }
    
    return true;
  });
  
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearFilters = () => {
    clearFilters();
    setSelectedLocation(null);
    setPostDateRange(undefined);
    setDeadlineDateRange(undefined);
    setCurrentPage(1);
  };
  
  const hasActiveFilters = filters.searchTerm || 
                          filters.category !== 'all' || 
                          selectedLocation || 
                          postDateRange || 
                          deadlineDateRange;

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold gold-gradient-text">Posts</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)} className="bg-gold hover:bg-gold/90 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
          <Button variant="outline" onClick={() => navigate('/manage/posts')} className="border-gold text-gold hover:bg-gold/10">
            Manage Posts
          </Button>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
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

          <Select
            value={selectedLocation || "any"}
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Location">
                <div className="flex items-center gap-2">
                  {selectedLocation && <MapPin className="h-4 w-4" />}
                  {selectedLocation || "Location"}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Location</SelectItem>
              {LOCATIONS.filter(location => location !== "Any Location").map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full md:w-[180px]",
                  !postDateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {postDateRange?.from ? (
                  postDateRange.to ? (
                    <>
                      {format(postDateRange.from, "LLL dd, y")} - {format(postDateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(postDateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Post Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={postDateRange?.from}
                selected={postDateRange}
                onSelect={setPostDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full md:w-[180px]",
                  !deadlineDateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadlineDateRange?.from ? (
                  deadlineDateRange.to ? (
                    <>
                      {format(deadlineDateRange.from, "LLL dd, y")} - {format(deadlineDateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(deadlineDateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Event Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={deadlineDateRange?.from}
                selected={deadlineDateRange}
                onSelect={setDeadlineDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
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
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found.</p>
          {hasActiveFilters && (
            <p className="text-sm mt-2">
              Try adjusting your search filters.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isApplied={!!appliedPosts[post.id]}
                isLiked={!!likedPosts[post.id]}
                applicationCount={applicationCounts[post.id] || 0}
                onApply={handleApplyToPost}
                onLike={handleLikePost}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  if (page === 2 || page === totalPages - 1) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <CreatePostDialog 
        isOpen={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreatePostSubmit}
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

      <Dialog open={!!selectedPost} onOpenChange={(open) => { if (!open) setSelectedPost(null); }}>
        <DialogContent className="max-w-2xl">
          {selectedPost && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPost.title}</DialogTitle>
                <DialogDescription>
                  Posted by {selectedPost.creator_name || 'Anonymous'}
                  {selectedPost.creator_profession && <span> • {selectedPost.creator_profession}</span>}
                </DialogDescription>
              </DialogHeader>
              <div className="my-4">
                <p className="mb-2"><strong>Category:</strong> {selectedPost.category}</p>
                <p className="mb-2"><strong>Description:</strong> {selectedPost.description}</p>
                {selectedPost.media_url && (
                  <div className="mb-2">
                    {selectedPost.media_type === 'image' ? (
                      <img src={selectedPost.media_url} alt={selectedPost.title} className="w-full max-h-64 object-contain rounded" />
                    ) : selectedPost.media_type === 'video' ? (
                      <video src={selectedPost.media_url} controls className="w-full max-h-64 object-contain rounded" />
                    ) : null}
                  </div>
                )}
                {selectedPost.event_date && (
                  <p className="mb-2"><strong>Event/Deadline Date:</strong> {format(new Date(selectedPost.event_date), 'PPP')}</p>
                )}
                {selectedPost.external_url && (
                  <p className="mb-2"><strong>External URL:</strong> <a href={selectedPost.external_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{selectedPost.external_url.length > 50 ? selectedPost.external_url.slice(0, 50) + '...' : selectedPost.external_url}</a></p>
                )}
                {(selectedPost.place || selectedPost.location || selectedPost.pincode || selectedPost.landmark) && (
                  <div className="mb-2">
                    <strong>Address Information:</strong>
                    <div className="ml-2">
                      {selectedPost.place && <div>Place: {selectedPost.place}</div>}
                      {selectedPost.location && <div>Location: {selectedPost.location}</div>}
                      {selectedPost.pincode && <div>Pincode: {selectedPost.pincode}</div>}
                      {selectedPost.landmark && <div>Landmark: {selectedPost.landmark}</div>}
                    </div>
                  </div>
                )}
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="mb-2">
                    <strong>Tags:</strong> {selectedPost.tags.map((tag, idx) => <span key={idx} className="inline-block bg-gray-200 text-gray-800 rounded px-2 py-1 text-xs mr-1">{tag}</span>)}
                  </div>
                )}
                <p className="mb-2"><strong>Total Applicants:</strong> {applicationCounts[selectedPost.id] || 0}</p>
                <p className="mb-2 text-sm text-muted-foreground">Created: {format(new Date(selectedPost.created_at), 'PPP')}</p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Posts;
