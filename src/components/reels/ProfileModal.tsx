import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Verified, MapPin, Calendar, Users, Heart, MessageCircle } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    name: string;
    profession: string;
    avatar?: string;
    verified?: boolean;
    bio?: string;
    location?: string;
    joinDate?: string;
    followers?: number;
    following?: number;
    posts?: number;
    likes?: number;
  };
}

export function ProfileModal({ isOpen, onClose, profile }: ProfileModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-lg">
                {profile.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                {profile.verified && (
                  <Badge variant="secondary" className="inline-flex items-center gap-1">
                    <Verified className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">{profile.profession}</p>
              
              {profile.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              {profile.joinDate && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {profile.joinDate}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button size="sm">
                <Users className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
          </div>
          
          {/* Bio */}
          {profile.bio && (
            <div>
              <h3 className="font-medium mb-2">About</h3>
              <p className="text-sm text-foreground/80">{profile.bio}</p>
            </div>
          )}
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-semibold">{profile.posts || 0}</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-semibold">{profile.followers || 0}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-semibold">{profile.following || 0}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-lg font-semibold">{profile.likes || 0}</div>
                <div className="text-xs text-muted-foreground">Likes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}