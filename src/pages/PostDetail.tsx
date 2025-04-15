
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
  Post,
  PostApplication
} from "@/services/postsService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Heart, ArrowLeft, Users, Clock, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApplicationUser {
  id: string;
  full_name: string;
  avatar_url: string;
  profession_type: string;
}

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
  const [applicantDetails, setApplicantDetails] = useState<Record<string, ApplicationUser>>({});
  const [isCreator, setIsCreator] = useState(false);

  // Fetch post details
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

  // Check if user has applied and liked
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

  // Get applications
  useEffect(() => {
    const loadApplications = async () => {
      if (!id) return;

      try {
        const apps = await getApplicationsForPost(id);
        setApplications(apps);
        setApplicationCount(apps.length);

        if (isCreator || (user?.email?.includes("admin"))) {
          // Fetch details of applicants if current user is post creator or admin
          const userIds = apps.map(app => app.user_id);
          
          if (userIds.length > 0) {
            const { data, error } = await supabase
              .from("profiles")
              .select("id, full_name, avatar_url, profession_type")
              .in("id", userIds);

            if (!error && data) {
              const userMap: Record<string, ApplicationUser> = {};
              data.forEach(user => {
                userMap[user.id] = user;
              });
              setApplicantDetails(userMap);
            }
          }
        }
      } catch (err) {
        console.error("Error loading applications:", err);
      }
    };

    loadApplications();
  }, [id, isCreator, user?.email]);

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
        </div>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{applicationCount} applied</span>
          </div>
        </div>
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
      
      {/* Show applicants section for post creator or admin */}
      {(isCreator || user?.email?.includes("admin")) && applications.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Applicants</h2>
          <div className="grid gap-4">
            {applications.map(application => {
              const applicant = applicantDetails[application.user_id];
              if (!applicant) return null;
              
              return (
                <Card key={application.id} className="border-brand/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={applicant.avatar_url} />
                        <AvatarFallback>
                          {applicant.full_name?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{applicant.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {applicant.profession_type || "Film Professional"}
                            </p>
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(application.applied_at), "MMM dd, yyyy")}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="text-xs"
                      >
                        <Link to={`/profile/${applicant.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
