
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/services/postsService';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
  isApplied: boolean;
  isLiked: boolean;
  applicationCount: number;
  onApply: (postId: string) => void;
  onLike: (postId: string) => void;
}

const MAX_DESCRIPTION_LENGTH = 150;

const PostCard = ({ 
  post, 
  isApplied, 
  isLiked,
  applicationCount, 
  onApply, 
  onLike 
}: PostCardProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const truncatedDescription = post.description.length > MAX_DESCRIPTION_LENGTH && !isExpanded
    ? `${post.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
    : post.description;
    
  const formattedDate = format(new Date(post.created_at), 'MMM dd, yyyy');
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
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
      
      <CardContent className="pb-2">
        <p className="text-sm text-foreground/80 mb-3">
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
        
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags && post.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mt-4">
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
              "flex items-center gap-2",
              isLiked && "text-red-500 border-red-500 hover:text-red-500 hover:border-red-500"
            )}
            onClick={() => onLike(post.id)}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-red-500")} />
            <span>{post.like_count}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </Button>
        </div>
        
        <Button
          variant={isApplied ? "secondary" : "default"}
          size="sm"
          disabled={isApplied}
          onClick={() => onApply(post.id)}
        >
          {isApplied ? 'Applied' : 'Apply'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
