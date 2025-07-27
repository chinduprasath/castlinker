
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Eye, Share2, MapPin, CalendarIcon, Link2, Image, Film } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/services/postsService';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PostCardProps {
  post: Post;
  isApplied: boolean;
  isLiked: boolean;
  applicationCount: number;
  onApply: (postId: string) => void;
  onLike: (postId: string) => void;
  onViewDetails: (post: Post) => void;
}

const MAX_DESCRIPTION_LENGTH = 150;

const PostCard = ({ 
  post, 
  isApplied, 
  isLiked,
  applicationCount, 
  onApply, 
  onLike,
  onViewDetails
}: PostCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const truncatedDescription = post.description.length > MAX_DESCRIPTION_LENGTH && !isExpanded
    ? `${post.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
    : post.description;
    
  const formattedDate = format(new Date(post.created_at), 'MMM dd, yyyy');

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
  
  const hasLocation = post.place || post.location || post.pincode;
  const eventDate = post.event_date ? new Date(post.event_date) : null;
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200 relative">
      {/* Top-right action buttons (Like and Share) */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={cn(
                  "rounded-full bg-background/80 backdrop-blur-sm border-muted",
                  isLiked && "text-red-500 border-red-500"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(post.id);
                }}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-red-500")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isLiked ? "Unlike" : "Like"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm border-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Share post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Horizontal layout: Image left, Content right */}
      <div className="flex flex-col md:flex-row">
        {/* Media section - left side on desktop */}
        <div className="w-full md:w-1/3 relative">
          {post.media_url ? (
            <div className="relative rounded-t-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden h-48 md:h-full min-h-[200px]">
              {post.media_type === 'image' ? (
                <img 
                  src={post.media_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              ) : post.media_type === 'video' ? (
                <div className="relative w-full h-full bg-black">
                  <video
                    src={post.media_url}
                    className="w-full h-full object-cover"
                    controls
                    poster={post.media_url + '?poster=true'}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="w-full h-48 md:h-full min-h-[200px] bg-muted flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
              <div className="text-center text-muted-foreground">
                {post.media_type === 'image' ? (
                  <>
                    <Image className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No image</p>
                  </>
                ) : post.media_type === 'video' ? (
                  <>
                    <Film className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No video</p>
                  </>
                ) : (
                  <>
                    <Image className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No media</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content section - right side on desktop */}
        <div className="flex-1 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Posted by {post.creator_name || 'Anonymous'} 
                  {post.creator_profession && <span> • {post.creator_profession}</span>}
                </p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary shrink-0">
                {post.category}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pb-2 space-y-2 flex-1">
            <p className="text-sm text-foreground/80 line-clamp-3">
              {truncatedDescription}
              {post.description.length > MAX_DESCRIPTION_LENGTH && (
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs ml-1"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Less' : 'More'}
                </Button>
              )}
            </p>

            {/* Event date if exists */}
            {eventDate && (
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>Event: {format(eventDate, 'MMM dd, yyyy')}</span>
              </div>
            )}
            
            {/* Location if exists */}
            {hasLocation && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">
                  {[post.place, post.location, post.pincode].filter(Boolean).join(', ')}
                </span>
              </div>
            )}

            {/* External URL if exists */}
            {post.external_url && (
              <div className="flex items-center text-xs">
                <Link2 className="h-3 w-3 mr-1 text-muted-foreground" />
                <a 
                  href={post.external_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {post.external_url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-2 flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground gap-3">
              <span>{formattedDate}</span>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>{applicationCount}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => onViewDetails(post)}
              >
                <Eye className="h-3 w-3" />
                <span className="hidden sm:inline">Details</span>
              </Button>
                  
              {user && (
                <Button 
                  size="sm" 
                  className="bg-gold hover:bg-gold/90 text-black dark:text-black"
                  disabled={isApplied}
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply(post.id);
                  }}
                >
                  {isApplied ? 'Applied' : 'Apply'}
                </Button>
              )}
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
