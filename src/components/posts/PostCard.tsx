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
    <Card className="w-full h-[280px] hover:shadow-md transition-shadow duration-200 relative overflow-hidden">
      {/* Top-right action buttons (Like and Share) */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={cn(
                  "rounded-full bg-background/80 backdrop-blur-sm border-muted w-8 h-8",
                  isLiked && "text-red-500 border-red-500"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(post.id);
                }}
              >
                <Heart className={cn("h-3 w-3", isLiked && "fill-red-500")} />
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
                className="rounded-full bg-background/80 backdrop-blur-sm border-muted w-8 h-8"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
              >
                <Share2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Share post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Horizontal layout: Image left, Content right */}
      <div className="flex h-full">
        {/* Media section - left side */}
        <div className="w-2/5 relative">
          {post.media_url ? (
            <div className="relative h-full overflow-hidden">
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
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                {post.media_type === 'image' ? (
                  <>
                    <Image className="h-6 w-6 mx-auto mb-1 opacity-40" />
                    <p className="text-xs">No image</p>
                  </>
                ) : post.media_type === 'video' ? (
                  <>
                    <Film className="h-6 w-6 mx-auto mb-1 opacity-40" />
                    <p className="text-xs">No video</p>
                  </>
                ) : (
                  <>
                    <Image className="h-6 w-6 mx-auto mb-1 opacity-40" />
                    <p className="text-xs">No media</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content section - right side */}
        <div className="flex-1 flex flex-col h-full">
          <CardHeader className="pb-2 px-4 pt-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold line-clamp-1 leading-tight">{post.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {post.creator_name || 'Anonymous'} 
                  {post.creator_profession && <span> • {post.creator_profession}</span>}
                </p>
                <Badge variant="outline" className="bg-primary/10 text-primary text-xs px-2 py-0.5 shrink-0">
                  {post.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-4 pb-2 flex-1 flex flex-col justify-between min-h-0">
            <div className="space-y-2">
              <div className="text-sm text-foreground/80">
                {!isExpanded ? (
                  <div className="line-clamp-2 leading-relaxed">
                    {post.description}
                  </div>
                ) : (
                  <div className="text-sm leading-relaxed max-h-20 overflow-y-auto">
                    {post.description}
                  </div>
                )}
                {post.description.length > 100 && (
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs text-primary"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </Button>
                )}
              </div>

              <div className="space-y-1">
                {/* Event date if exists */}
                {eventDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3 mr-1 shrink-0" />
                    <span className="truncate">Event: {format(eventDate, 'MMM dd')}</span>
                  </div>
                )}
                
                {/* Location if exists */}
                {hasLocation && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1 shrink-0" />
                    <span className="truncate">
                      {[post.place, post.location, post.pincode].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs px-2 py-0">
                      +{post.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="px-4 pb-3 pt-2 flex items-center justify-between mt-auto">
            <div className="flex items-center text-xs text-muted-foreground gap-3">
              <span>{format(new Date(post.created_at), 'MMM dd')}</span>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>{applicationCount}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs px-2 py-1 h-7"
                onClick={() => onViewDetails(post)}
              >
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Button>
                  
              {user && (
                <Button 
                  size="sm" 
                  className="bg-gold hover:bg-gold/90 text-black text-xs px-3 py-1 h-7"
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