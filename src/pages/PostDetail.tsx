import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchPostById,
  checkIfApplied,
  applyToPost,
  checkIfLiked,
  togglePostLike,
  getApplicationsForPost,
  getApplicantsByPostId,
  deletePost,
  Post,
  PostApplication
} from "@/services/postsService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { 
  Heart, 
  ArrowLeft, 
  Users, 
  Clock, 
  Calendar, 
  Tag, 
  Share2, 
  MapPin, 
  Link2,
  ExternalLink,
  Edit,
  Trash2,
  Search,
  Star,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreatePostDialog from "@/components/posts/CreatePostDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

interface ApplicationUser {
  id: string;
  full_name: string;
  avatar_url: string;
  profession_type: string;
  location: string;
  rating: number;
}

interface ApplicantWithProfile extends PostApplication {
  profile: ApplicationUser | null;
}

const PROFESSION_TYPES = ["All", "Actor", "Writer", "Director", "Music", "Cinematographer", "Other"];

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [applicationCount, setApplicationCount] = useState(0);
  const [applications, setApplications] = useState<PostApplication[]>([]);
  const [applicants, setApplicants] = useState<ApplicantWithProfile[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<ApplicantWithProfile[]>([]);
  const [isCreator, setIsCreator] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [professionFilter, setProfessionFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const isAdmin = user?.email?.includes("admin");
  const canModify = isCreator || isAdmin;

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      if (!id) return;
      
      try {
        const postData = await fetchPostById(id);
        if (postData) {
          setPost(postData);
          setIsCreator(user?.id === postData.created_by);
        } else {
          navigate("/posts");
          toast({
            title: "Post not found",
            description: "The post you're looking for doesn't exist or has been removed.",
            variant: "destructive"
          });
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load post details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, navigate, user?.id]);

  useEffect(() => {
    const checkUserInteractions = async () => {
      if (!id || !user || !post) return;

      try {
        const [hasApplied, hasLiked] = await Promise.all([
          checkIfApplied(id, user.id),
          checkIfLiked(id, user.id)
        ]);

        setIsApplied(hasApplied);
        setIsLiked(hasLiked);
      } catch (err) {
        console.error("Error checking user interactions:", err);
      }
    };

    checkUserInteractions();
  }, [id, user, post]);

  useEffect(() => {
    const loadApplications = async () => {
      if (!id) return;

      try {
        const apps = await getApplicationsForPost(id);
        setApplications(apps);
        setApplicationCount(apps.length);

        if (isCreator || isAdmin) {
          const applicantsWithProfiles = await getApplicantsByPostId(id);
          setApplicants(applicantsWithProfiles);
          setFilteredApplicants(applicantsWithProfiles);
        }
      } catch (err) {
        console.error("Error loading applications:", err);
      }
    };

    loadApplications();
  }, [id, isCreator, isAdmin, user?.email]);

  useEffect(() => {
    if (!applicants.length) return;

    let filtered = [...applicants];

    if (professionFilter !== "All") {
      filtered = filtered.filter(
        app => app.profile?.profession_type === professionFilter
      );
    }

    if (locationFilter) {
      const searchTerm = locationFilter.toLowerCase();
      filtered = filtered.filter(
        app => app.profile?.location?.toLowerCase().includes(searchTerm)
      );
    }

    if (ratingFilter) {
      const minRating = parseInt(ratingFilter);
      filtered = filtered.filter(
        app => (app.profile?.rating || 0) >= minRating
      );
    }

    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(app => {
        const appliedDate = new Date(app.applied_at);
        return (
          appliedDate >= dateRange.from! && 
          appliedDate <= (dateRange.to || dateRange.from)!
        );
      });
    }

    setFilteredApplicants(filtered);
  }, [applicants, professionFilter, locationFilter, ratingFilter, dateRange]);

  const handleApply = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for this opportunity.",
        variant: "destructive"
      });
      return;
    }

    if (!id) return;

    try {
      const application = await applyToPost(id, user.id);
      
      if (application) {
        setIsApplied(true);
        setApplicationCount(prev => prev + 1);
        toast({
          title: "Application Submitted",
          description: "Your application has been successfully submitted.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like posts.",
        variant: "destructive"
      });
      return;
    }

    if (!id) return;

    try {
      const liked = await togglePostLike(id, user.id);
      
      if (liked !== null) {
        setIsLiked(liked);
        if (post) {
          setPost({
            ...post,
            like_count: liked ? post.like_count + 1 : Math.max(0, post.like_count - 1)
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    const postUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: post?.title || "Post",
        text: post?.description?.substring(0, 100) + (post?.description.length > 100 ? '...' : ''),
        url: postUrl,
      })
      .catch(() => {
        copyToClipboard(postUrl);
      });
    } else {
      copyToClipboard(postUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Post link has been copied to clipboard",
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy the link to clipboard",
          variant: "destructive"
        });
      });
  };

  const handleDeletePost = async () => {
    if (!id || !canModify) return;

    try {
      const deleted = await deletePost(id);
      
      if (deleted) {
        toast({
          title: "Post deleted",
          description: "The post has been successfully deleted.",
        });
        navigate('/posts');
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-12 flex justify-center items-center">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-32 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl py-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Post not found</h2>
        <p className="text-muted-foreground mb-6">This post may have been removed or doesn't exist.</p>
        <Button asChild>
          <Link to="/posts">Back to Posts</Link>
        </Button>
      </div>
    );
  }

  const formattedDate = format(new Date(post.created_at), "MMM dd, yyyy");
  const eventDate = post.event_date ? new Date(post.event_date) : null;
  const hasLocation = post.place || post.location || post.pincode;

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/posts")}
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Button>
        
        {post.media_url && (
          <div className="mb-6 rounded-lg overflow-hidden">
            {post.media_type === 'image' ? (
              <img 
                src={post.media_url} 
                alt={post.title} 
                className="w-full max-h-[400px] object-cover" 
              />
            ) : post.media_type === 'video' ? (
              <video
                src={post.media_url}
                controls
                className="w-full max-h-[400px] object-contain bg-black"
              />
            ) : null}
          </div>
        )}
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {post.category}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Posted by {post.creator_name || "Anonymous"} 
                {post.creator_profession && <span> • {post.creator_profession}</span>}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={isLiked ? "outline" : "ghost"} 
              className={cn(
                "flex items-center gap-2",
                isLiked && "text-red-500 border-red-500 hover:text-red-500 hover:border-red-500"
              )}
              onClick={handleLike}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-red-500")} />
              <span>{post.like_count}</span>
            </Button>

            <Button
              variant="ghost"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>

            {canModify && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive flex items-center gap-2"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Posted on {formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{applicationCount} applied</span>
          </div>
        </div>

        {eventDate && (
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Event date: {format(eventDate, 'MMM dd, yyyy')}</span>
          </div>
        )}
        
        {hasLocation && (
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {[
                post.place, 
                post.location, 
                post.pincode, 
                post.landmark
              ].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
        
        {post.external_url && (
          <div className="flex items-center text-sm mt-2">
            <Link2 className="h-4 w-4 mr-1 text-muted-foreground" />
            <a 
              href={post.external_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center"
            >
              {post.external_url.replace(/^https?:\/\//, '')}
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        )}
      </div>

      <Separator className="my-6" />
      
      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap">{post.description}</p>
      </div>
      
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {!isCreator && (
        <div className="mt-8">
          <Button 
            size="lg"
            disabled={isApplied}
            onClick={handleApply}
            className={isApplied ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isApplied ? "Application Submitted" : "Apply Now"}
          </Button>
        </div>
      )}
      
      {(isCreator || isAdmin) && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Applicants ({filteredApplicants.length})</h2>
          
          <div className="bg-card p-4 rounded-lg mb-6 border">
            <h3 className="text-lg font-medium mb-4">Filter Applicants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Profession Type</label>
                <Select 
                  value={professionFilter} 
                  onValueChange={setProfessionFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Professions" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFESSION_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Location</label>
                <Input
                  placeholder="Search by location"
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Minimum Rating</label>
                <Select 
                  value={ratingFilter} 
                  onValueChange={setRatingFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any rating</SelectItem>
                    <SelectItem value="3">3+ stars</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="5">5 stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Application Date</label>
                <DatePickerWithRange
                  date={dateRange}
                  setDate={setDateRange}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setProfessionFilter("All");
                  setLocationFilter("");
                  setRatingFilter("");
                  setDateRange(undefined);
                }}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
          
          {filteredApplicants.length > 0 ? (
            <div className="grid gap-4">
              {filteredApplicants.map(application => {
                const { profile } = application;
                if (!profile) return null;
                
                return (
                  <Card key={application.id} className="border-brand/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={profile.avatar_url} />
                          <AvatarFallback>
                            {profile.full_name?.substring(0, 2) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{profile.full_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {profile.profession_type || "Film Professional"}
                              </p>
                            </div>
                            
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                {format(new Date(application.applied_at), "MMM dd, yyyy")}
                              </div>
                              
                              {profile.rating > 0 && (
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                  <span className="text-xs ml-1">{profile.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {profile.location && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{profile.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          className="text-xs"
                        >
                          <Link to={`/profile/${profile.id}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-lg">
              <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-40" />
              <p className="mt-2 text-muted-foreground">No applicants found matching your filters</p>
              {applicationCount > 0 && (
                <Button 
                  variant="link"
                  onClick={() => {
                    setProfessionFilter("All");
                    setLocationFilter("");
                    setRatingFilter("");
                    setDateRange(undefined);
                  }}
                >
                  Clear filters to view all applicants
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <CreatePostDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        editPost={post}
      />
    </div>
  );
};

export default PostDetail;
