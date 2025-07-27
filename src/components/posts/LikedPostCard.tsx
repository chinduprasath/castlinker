import { Heart, MapPin, Calendar, Clock, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/services/postsService';

interface LikedPostCardProps {
  post: Post;
  onViewDetails: (postId: string) => void;
  onApply: (postId: string) => void;
  onUnlike: (postId: string) => void;
  isApplied?: boolean;
}

export const LikedPostCard = ({ 
  post, 
  onViewDetails, 
  onApply, 
  onUnlike,
  isApplied = false 
}: LikedPostCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {post.creator_name || 'Unknown Creator'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUnlike(post.id)}
            className="text-red-500 hover:text-red-600"
          >
            <Heart className="h-5 w-5 fill-current" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{post.location || 'Location not specified'}</span>
            </div>
            <Badge variant="outline">{post.category}</Badge>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Posted {formatDate(post.created_at)}</span>
            </div>
            {post.event_date && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Event: {formatDate(post.event_date)}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="text-sm text-foreground">
            <p>{truncateText(post.description)}</p>
          </div>

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
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              onClick={() => onViewDetails(post.id)}
              className="flex items-center gap-1"
            >
              View Details
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={() => onApply(post.id)}
              disabled={isApplied}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isApplied ? 'Applied' : 'Apply Now'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};