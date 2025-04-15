
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Eye, Share2, Edit, Trash2, MapPin, CalendarIcon, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/services/postsService';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CreatePostDialog from './CreatePostDialog';

interface PostCardProps {
  post: Post;
  isApplied: boolean;
  isLiked: boolean;
  applicationCount: number;
  onApply: (postId: string) => void;
  onLike: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const MAX_DESCRIPTION_LENGTH = 150;

const PostCard = ({ 
  post, 
  isApplied, 
  isLiked,
  applicationCount, 
  onApply, 
  onLike,
  onDelete
}: PostCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const truncatedDescription = post.description.length > MAX_DESCRIPTION_LENGTH && !isExpanded
    ? `${post.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
    : post.description;
    
  const formattedDate = format(new Date(post.created_at), 'MMM dd, yyyy');

  const isCreator = user && user.id === post.created_by;
  const isAdmin = user?.email?.includes("admin");
  const canModify = isCreator || isAdmin;

  const handleShare = () => {
    const postUrl = `${window.location.origin}/posts/${post.id}`;
    
    // Try to use the native share API if available
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description.substring(0, 100) + (post.description.length > 100 ? '...' : ''),
        url: postUrl,
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        copyToClipboard(postUrl);
      });
    } else {
      // Fallback to clipboard
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

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post.id);
      setShowDeleteDialog(false);
    }
  };
  
  const hasLocation = post.place || post.location || post.pincode;
  const eventDate = post.event_date ? new Date(post.event_date) : null;
  
  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow duration-200">
        {/* Media Preview at the top if exists */}
        {post.media_url && (
          <div className="w-full relative rounded-t-lg overflow-hidden">
            {post.media_type === 'image' ? (
              <img 
                src={post.media_url} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
            ) : post.media_type === 'video' ? (
              <div className="relative w-full h-48 bg-black">
                <video
                  src={post.media_url}
                  className="w-full h-full object-cover"
                  controls
                  poster={post.media_url + '?poster=true'}
                />
              </div>
            ) : null}
          </div>
        )}
        
        <CardHeader className={cn("pb-2", post.media_url && "pt-3")}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Posted by {post.creator_name || 'Anonymous'} 
                {post.creator_profession && <span> • {post.creator_profession}</span>}
              </p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {post.category}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2 space-y-3">
          <p className="text-sm text-foreground/80">
            {truncatedDescription}
            {post.description.length > MAX_DESCRIPTION_LENGTH && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Read Less' : 'Read More'}
              </Button>
            )}
          </p>

          {/* Event date if exists */}
          {eventDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
              <span>Event date: {format(eventDate, 'MMM dd, yyyy')}</span>
            </div>
          )}
          
          {/* Location if exists */}
          {hasLocation && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              <span>
                {[
                  post.place, 
                  post.location, 
                  post.pincode
                ].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* External URL if exists */}
          {post.external_url && (
            <div className="flex items-center text-xs">
              <Link2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <a 
                href={post.external_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate max-w-[250px]"
              >
                {post.external_url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags && post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <span>{formattedDate}</span>
            <div className="flex items-center ml-4">
              <Users className="h-3 w-3 mr-1" />
              <span>{applicationCount} applied</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className={cn(
                "flex items-center gap-1.5",
                isLiked && "text-red-500 border-red-500 hover:text-red-500 hover:border-red-500"
              )}
              onClick={() => onLike(post.id)}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-red-500")} />
              <span>{post.like_count}</span>
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {canModify && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEditDialog(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit post</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete post</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
            
            <Button
              variant={isApplied ? "secondary" : "default"}
              size="sm"
              disabled={isApplied}
              onClick={() => onApply(post.id)}
            >
              {isApplied ? 'Applied' : 'Apply'}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CreatePostDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        editPost={post}
      />

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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostCard;
