import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import useAdminAuth from "@/hooks/useAdminAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Calendar,
  ExternalLink,
  Heart,
  MapPin,
  MoreHorizontal,
  Share,
  Users,
  X,
  Edit,
} from "lucide-react";
import {
  fetchPostById,
  checkIfApplied,
  checkIfLiked,
  togglePostLike,
  applyToPost,
  getApplicantsByPostId,
  deletePost,
} from "@/services/postsService";

// Filter components
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { ProfessionFilter } from "@/components/filters/ProfessionFilter";
import { LocationFilter } from "@/components/filters/LocationFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { Profession } from "@/types/talent";
import CreatePostDialog from "@/components/posts/CreatePostDialog";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Filter states
  const [professionFilter, setProfessionFilter] = useState<Profession[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  
  const [filteredApplicants, setFilteredApplicants] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchPostData();
  }, [id]);

  useEffect(() => {
    if (!applicants) return;
    applyFilters();
  }, [professionFilter, locationFilter, dateFilter, ratingFilter, applicants]);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const postData = await fetchPostById(id!);
      
      if (!postData) {
        toast({
          title: "Post not found",
          description: "The post you're looking for doesn't exist or has been removed.",
          variant: "destructive",
        });
        navigate("/posts");
        return;
      }
      
      setPost(postData);
      setLikeCount(postData.like_count || 0);
      
      if (user) {
        const applied = await checkIfApplied(id!, user.id);
        const liked = await checkIfLiked(id!, user.id);
        setIsApplied(applied);
        setIsLiked(liked);
      }
      
      // If user is creator or admin, fetch applicants
      if (user && (postData.created_by === user.id || isAdmin)) {
        const applicantData = await getApplicantsByPostId(id!);
        setApplicants(applicantData || []);
        setFilteredApplicants(applicantData || []);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "Failed to load post details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await togglePostLike(id!, user.id);
      setIsLiked(!!result);
      setLikeCount(prev => result ? prev + 1 : Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for this opportunity.",
        variant: "destructive",
      });
      return;
    }

    if (isApplied) {
      toast({
        title: "Already Applied",
        description: "You have already applied to this post.",
      });
      return;
    }

    try {
      const result = await applyToPost(id!, user.id);
      if (result) {
        setIsApplied(true);
        toast({
          title: "Application Submitted",
          description: "Your application has been successfully submitted.",
        });
      }
    } catch (error) {
      console.error("Error applying to post:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: url,
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "Post link has been copied to clipboard.",
        });
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Post link has been copied to clipboard.",
      });
    }
  };

  const confirmDelete = () => {
    setShowConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      const success = await deletePost(id!);
      if (success) {
        toast({
          title: "Post Deleted",
          description: "The post has been successfully deleted.",
        });
        navigate("/posts");
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const applyFilters = () => {
    if (!applicants || applicants.length === 0) {
      setFilteredApplicants([]);
      return;
    }
    
    let filtered = [...applicants];
    
    // Filter by profession
    if (professionFilter && professionFilter.length > 0) {
      filtered = filtered.filter(applicant => 
        applicant.profile && 
        applicant.profile.profession_type && 
        professionFilter.includes(applicant.profile.profession_type)
      );
    }
    
    // Filter by location
    if (locationFilter && locationFilter.length > 0) {
      filtered = filtered.filter(applicant => 
        applicant.profile && 
        applicant.profile.location && 
        locationFilter.some(loc => applicant.profile.location.includes(loc))
      );
    }
    
    // Filter by date range
    if (dateFilter && dateFilter.from) {
      const fromDate = dateFilter.from;
      const toDate = dateFilter.to || fromDate;
      
      filtered = filtered.filter(applicant => {
        if (!applicant.applied_at) return false;
        const appliedDate = new Date(applicant.applied_at);
        return appliedDate >= fromDate && appliedDate <= toDate;
      });
    }
    
    // Filter by rating
    if (ratingFilter && ratingFilter !== "all") {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(applicant => 
        applicant.profile && 
        applicant.profile.rating && 
        applicant.profile.rating >= minRating
      );
    }
    
    setFilteredApplicants(filtered);
  };

  const clearFilters = () => {
    setProfessionFilter([]);
    setLocationFilter([]);
    setDateFilter(undefined);
    setRatingFilter("all");
  };

  const isCreator = user && post && user.id === post.created_by;
  const canManagePost = isCreator || isAdmin;

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full md:col-span-2" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/posts">Back to Posts</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Link to="/posts" className="text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Posts
        </Link>
      </div>
      
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex items-center text-muted-foreground gap-2 flex-wrap">
                <Badge variant="outline">{post.category}</Badge>
                <span className="text-sm">
                  Posted {format(new Date(post.created_at), "PP")}
                </span>
                <span className="text-sm">
                  by {post.creator_name || "Anonymous"}
                  {post.creator_profession && ` • ${post.creator_profession}`}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleShare} title="Share">
                <Share className="h-4 w-4" />
              </Button>
              
              {canManagePost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="cursor-pointer">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={confirmDelete} className="cursor-pointer text-destructive">
                      <X className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          
          {post.media_url && (
            <div className="mb-6 rounded-md overflow-hidden bg-muted">
              {post.media_type === 'image' ? (
                <img 
                  src={post.media_url} 
                  alt={post.title} 
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              ) : post.media_type === 'video' ? (
                <video 
                  src={post.media_url} 
                  controls
                  className="w-full h-auto max-h-[400px]"
                />
              ) : null}
            </div>
          )}
          
          <div className="mb-6 prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{post.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                {post.event_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Event Date: {format(new Date(post.event_date), "PPP")}</span>
                  </div>
                )}
                
                {(post.location || post.place || post.pincode) && (
                  <div className="flex gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    <div>
                      {post.place && <div>{post.place}</div>}
                      {post.location && (
                        <div>
                          {post.location}
                          {post.pincode && ` - ${post.pincode}`}
                        </div>
                      )}
                      {post.landmark && <div className="text-sm text-muted-foreground">Landmark: {post.landmark}</div>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{applicants.length} Applications</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span>{likeCount} Likes</span>
                </div>
                
                {post.external_url && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={post.external_url}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-primary truncate hover:underline"
                    >
                      External Link
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Tags:</div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <CardFooter className="bg-muted/30 p-4 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant={isLiked ? "default" : "outline"} 
              size="sm"
              onClick={handleLike}
              className={isLiked ? "bg-pink-600 hover:bg-pink-700" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
              {isLiked ? "Liked" : "Like"}
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          
          {!isCreator && (
            <Button 
              onClick={handleApply}
              disabled={isApplied}
            >
              {isApplied ? "Applied" : "Apply Now"}
            </Button>
          )}
        </CardFooter>
      </div>

      {canManagePost && (
        <div className="mt-8">
          <Tabs defaultValue="applicants" className="w-full">
            <TabsList className="grid grid-cols-1 md:grid-cols-2">
              <TabsTrigger value="applicants">Applicants ({applicants.length})</TabsTrigger>
              <TabsTrigger value="filters">Filter Applicants</TabsTrigger>
            </TabsList>
            
            <TabsContent value="applicants">
              <Card>
                <CardContent className="p-6">
                  {filteredApplicants.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {applicants.length === 0 
                          ? "No applications received yet." 
                          : "No applicants match your filter criteria."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredApplicants.map((applicant) => (
                        <div 
                          key={applicant.id} 
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage 
                              src={applicant.profile?.avatar_url} 
                              alt={applicant.profile?.full_name || "User"} 
                            />
                            <AvatarFallback>
                              {(applicant.profile?.full_name || "U").charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="font-medium">
                              {applicant.profile?.full_name || "Anonymous User"}
                            </div>
                            {applicant.profile?.profession_type && (
                              <div className="text-sm text-muted-foreground">
                                {applicant.profile.profession_type}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              Applied {format(new Date(applicant.applied_at), "PP")}
                            </div>
                          </div>
                          
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/profile/${applicant.user_id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="filters">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Profession Type</label>
                      <ProfessionFilter 
                        selectedProfessions={professionFilter || []}
                        onProfessionChange={setProfessionFilter} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <LocationFilter 
                        selectedLocations={locationFilter || []}
                        onLocationChange={setLocationFilter} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Application Date Range</label>
                      <DatePickerWithRange 
                        date={dateFilter} 
                        setDate={setDateFilter}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating</label>
                      <Select value={ratingFilter} onValueChange={setRatingFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Rating</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="3">3+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <CreatePostDialog 
          open={showEditDialog} 
          onOpenChange={setShowEditDialog} 
          editPost={post}
        />
      )}
    </div>
  );
};

export default PostDetail;
