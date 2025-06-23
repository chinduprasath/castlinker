
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageSquare, UserPlus, ExternalLink, Star, MapPin, Calendar, Award, Crown } from 'lucide-react';
import { useTalentDirectory } from '@/hooks/useTalentDirectory';

interface TalentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string | null;
  isLiked: boolean;
  isWishlisted: boolean;
  connectionStatus: string | null;
  onConnect?: () => void;
  onShare?: () => void;
  onMessage?: () => void;
  onLike?: () => void;
  onWishlist?: () => void;
}

const TalentProfileModal: React.FC<TalentProfileModalProps> = ({
  isOpen,
  onClose,
  profileId,
  isLiked,
  isWishlisted,
  connectionStatus,
  onConnect,
  onShare,
  onMessage,
  onLike,
  onWishlist
}) => {
  const { talents } = useTalentDirectory();
  const talent = profileId ? talents.find(t => t.id === profileId) : null;

  if (!talent) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Talent Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={talent.avatar} alt={talent.name} />
                <AvatarFallback className="text-2xl">{talent.name?.charAt(0) || 'T'}</AvatarFallback>
              </Avatar>
              
              <div className="flex gap-2">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  onClick={onLike}
                  className={isLiked ? "text-red-500" : ""}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button
                  variant={isWishlisted ? "default" : "outline"}
                  size="sm"
                  onClick={onWishlist}
                  className={isWishlisted ? "text-blue-500" : ""}
                >
                  <Award className="h-4 w-4 mr-2" />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </Button>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{talent.name}</h2>
                  {talent.isPremium && (
                    <Badge variant="secondary" className="bg-gold/10 text-gold border-0">
                      <Crown className="h-4 w-4 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {talent.isVerified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>
                
                <p className="text-lg text-muted-foreground mb-2">{talent.role}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{talent.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(talent.joinedDate || talent.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-gold" />
                    <span>{talent.rating?.toFixed(1)} ({talent.reviews} Reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>{talent.likesCount} Likes</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={onConnect}>
                  {connectionStatus === 'pending' ? (
                    <>Pending...</>
                  ) : connectionStatus === 'accepted' ? (
                    <>Connected <UserPlus className="h-4 w-4 ml-2" /></>
                  ) : (
                    <>Connect <UserPlus className="h-4 w-4 ml-2" /></>
                  )}
                </Button>
                <Button variant="outline" onClick={onMessage}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="outline" onClick={onShare}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Bio Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-muted-foreground">{talent.bio}</p>
          </div>
          
          <Separator />
          
          {/* Skills Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {talent.skills?.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Experience & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Experience</h3>
              <p className="text-muted-foreground">
                {talent.experience_years || talent.experience} years of professional experience
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {talent.languages?.map((language) => (
                  <Badge key={language} variant="secondary">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {talent.featuredIn && talent.featuredIn.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Featured In</h3>
                <div className="flex flex-wrap gap-2">
                  {talent.featuredIn.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TalentProfileModal;
