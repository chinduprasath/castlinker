
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, getApplicantsByPostId, PostApplication, Post, checkIfLiked, togglePostLike } from '@/services/postsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Share2, Calendar, MapPin, Link2, ArrowLeft, Users, Pencil, Trash2, Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicantCount, setApplicantCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch post data
  useEffect(() => {
    const loadPostData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const postData = await fetchPostById(id);
        setPost(postData);
        
        // Check if the user has liked the post
        if (user) {
          const liked = await checkIfLiked(id, user.id);
          setIsLiked(liked);
        }
        
        // Fetch applicant count only
        const applicantsData = await getApplicantsByPostId(id);
        setApplicantCount(applicantsData?.length || 0);
      } catch (error) {
        console.error('Error loading post:', error);
        toast({
          title: 'Error',
          description: 'Failed to load post details',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPostData();
  }, [id, user]);
  
  // Handle post like/unlike
  const handleLikeToggle = async () => {
    if (!user || !post) return;
    
    try {
      const result = await togglePostLike(post.id, user.id);
      
      if (result !== null) {
        setIsLiked(result);
        setPost(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            like_count: result 
              ? prev.like_count + 1 
              : Math.max(0, prev.like_count - 1)
          };
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: 'Error',
        description: 'Failed to like post',
        variant: 'destructive'
      });
    }
  };
  
  // Share post function
  const handleShare = () => {
    if (!post) return;
    
    const postUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description.substring(0, 100) + (post.description.length > 100 ? '...' : ''),
        url: postUrl,
      }).catch(error => {
        console.error('Error sharing:', error);
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

  // Delete post function
  const handleDeletePost = async () => {
    if (!post || !user) return;
    
    try {
      const { deletePost } = await import('@/services/postsService');
      const success = await deletePost(post.id);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Post has been deleted',
        });
        navigate('/posts');
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive'
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };
  
  // Apply to post function
  const handleApplyToPost = async () => {
    if (!user || !post) return;
    
    try {
      const { applyToPost } = await import('@/services/postsService');
      await applyToPost(post.id, user.id);
      
      toast({
        title: "Application Submitted",
        description: "Your application has been sent successfully.",
      });
      
      // Update applicant count
      setApplicantCount(prev => prev + 1);
    } catch (error) {
      console.error('Error applying:', error);
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Check if user is creator or admin
  const isCreator = user && post && user.id === post.created_by;
  const isAdmin = user?.email?.includes("admin");
  const canModify = isCreator || isAdmin;
  
  if (loading) {
    return (
      <div className="container max-w-4xl py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container max-w-4xl py-8 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="text-muted-foreground mt-2">The post you're looking for doesn't exist or has been removed.</p>
        <Button 
          className="mt-4" 
          onClick={() => navigate('/posts')}
          variant="outline"
        >
          Back to Posts
        </Button>
      </div>
    );
  }
  
  // Format dates
  const formattedDate = format(new Date(post.created_at), 'MMM dd, yyyy');
  const eventDate = post.event_date ? format(new Date(post.event_date), 'MMM dd, yyyy') : null;
  
  return (
    <div className="container max-w-4xl py-8">
      {/* Header with Close/Back button */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground"
          onClick={() => navigate('/posts')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/posts')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Post Information */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Posted by {post.creator_name || 'Anonymous'}</span>
                  <span>•</span>
                  <span>{formattedDate}</span>
                  {post.creator_profession && (
                    <>
                      <span>•</span>
                      <Badge variant="outline">{post.creator_profession}</Badge>
                    </>
                  )}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    isLiked && "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600"
                  )}
                  onClick={handleLikeToggle}
                >
                  <Heart className={cn("h-4 w-4 mr-2", isLiked && "fill-red-500")} />
                  <span>{post.like_count}</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                
                {canModify && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/posts/${post.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Category and Tags */}
            <div className="space-y-3">
              <Badge variant="secondary" className="text-sm">
                {post.category}
              </Badge>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="whitespace-pre-wrap text-base leading-relaxed">{post.description}</p>
            </div>

            {/* Event/Deadline Date */}
            {eventDate && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Event/Deadline Date
                </h3>
                <p className="text-lg font-medium">{eventDate}</p>
              </div>
            )}

            {/* External URL */}
            {post.external_url && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Link2 className="h-5 w-5 mr-2" />
                  External URL
                </h3>
                <a 
                  href={post.external_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline text-lg break-all"
                >
                  {post.external_url}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media */}
        {post.media_url && (
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent>
              {post.media_type === 'image' ? (
                <img
                  src={post.media_url}
                  alt={post.title}
                  className="w-full h-auto max-h-[500px] object-cover rounded-lg"
                />
              ) : post.media_type === 'video' ? (
                <video 
                  src={post.media_url} 
                  controls 
                  className="w-full rounded-lg"
                />
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Location Details (Optional Section) */}
        {(post.place || post.location || post.pincode || post.landmark) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {post.place && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Place Name</p>
                  <p className="text-base">{post.place}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.location && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="text-base">{post.location}</p>
                  </div>
                )}
                
                {post.pincode && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pincode</p>
                    <p className="text-base">{post.pincode}</p>
                  </div>
                )}
              </div>
              
              {post.landmark && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Landmark</p>
                  <p className="text-base">{post.landmark}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Applicants:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {applicantCount}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline"
            size="lg"
            onClick={() => navigate('/posts')}
            className="flex-1 sm:flex-none"
          >
            Back to Posts
          </Button>
          
          {user && (
            <Button 
              className="flex-1 sm:flex-none bg-gold hover:bg-gold/90 text-black dark:text-black"
              size="lg"
              onClick={handleApplyToPost}
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>
      
      {/* Confirm delete dialog */}
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
    </div>
  );
};

export default PostDetail;
