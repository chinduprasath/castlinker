
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, MapPin, Star, Film, Bookmark, Clock, MessageCircle } from 'lucide-react';
import { TalentProfile } from '@/hooks/useTalentDirectory';
import { Separator } from '@/components/ui/separator';

type ProfileDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: TalentProfile | null;
  onMessage: (profile: TalentProfile) => void;
};

export function ProfileDialog({ isOpen, onClose, profile, onMessage }: ProfileDialogProps) {
  if (!profile) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-cinematic-dark border-gold/20 overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold sr-only">
            {profile.name}'s Profile
          </DialogTitle>
        </DialogHeader>
        
        {/* Header/Bio Section */}
        <div className="flex flex-col md:flex-row gap-6 -mt-2">
          <div className="md:w-1/3 flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 border-2 border-gold/30 mb-4">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              {profile.isVerified && (
                <Check className="h-5 w-5 text-gold bg-gold/20 rounded-full p-0.5" />
              )}
            </div>
            
            <div className="text-sm text-foreground/70 mb-3">{profile.role}</div>
            
            <div className="flex items-center justify-center gap-1 mb-3">
              <MapPin className="h-4 w-4 text-foreground/70" />
              <span className="text-sm">{profile.location}</span>
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(profile.rating) ? "text-gold fill-gold" : "text-foreground/20"}`} />
                ))}
                <span className="ml-2 text-sm">{profile.rating} ({profile.reviews} reviews)</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 justify-center mb-4">
              {profile.isPremium && (
                <Badge className="bg-gold text-black">Premium</Badge>
              )}
              {profile.isAvailable ? (
                <Badge className="bg-green-600">Available Now</Badge>
              ) : (
                <Badge variant="outline">Not Available</Badge>
              )}
            </div>
            
            <Button 
              onClick={() => onMessage(profile)}
              className="w-full mb-2 gap-2 bg-gold text-black hover:bg-gold/90"
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
            
            <Button 
              variant="outline"
              className="w-full gap-2 border-gold/20 hover:bg-gold/10"
            >
              <Bookmark className="h-4 w-4" />
              Save Profile
            </Button>
          </div>
          
          <div className="md:w-2/3">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-foreground/80">{profile.bio}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-foreground/60 mb-1">Experience</h4>
                <p className="font-medium">{profile.experience} years</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-foreground/60 mb-1">Languages</h4>
                <p className="font-medium">{profile.languages.join(', ')}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <Badge key={skill} variant="outline" className="bg-gold/5 border-gold/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            {profile.featuredIn.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Featured In</h3>
                <ul className="space-y-2">
                  {profile.featuredIn.map(project => (
                    <li key={project} className="flex items-start gap-2">
                      <Film className="h-5 w-5 text-gold mt-0.5" />
                      <span>{project}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <Separator className="my-4 bg-gold/10" />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-gold/20">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
