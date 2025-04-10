
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TalentProfile } from '@/hooks/useTalentDirectory';

type ConnectDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: TalentProfile | null;
  onConnect: (talentId: string, message?: string) => Promise<void>;
};

export function ConnectDialog({ isOpen, onClose, profile, onConnect }: ConnectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleConnect = async () => {
    if (!profile) return;
    
    setIsSubmitting(true);
    try {
      await onConnect(profile.userId, message);
      onClose();
      setMessage(''); // Clear message after successful connection
    } catch (error) {
      console.error('Error sending connection request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-cinematic-dark border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Connect with {profile.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <p className="text-foreground/80">
            Send a connection request to {profile.name}. Once accepted, you'll be able to collaborate directly.
          </p>
          
          <div className="bg-black/20 p-4 rounded-lg">
            <p className="text-sm text-foreground/70 mb-2">You'll be connecting with:</p>
            <p className="font-medium">{profile.name}</p>
            <p className="text-sm">{profile.role} • {profile.location}</p>
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder={`Add a personal message to ${profile.name}... (optional)`}
              className="bg-background/50 border-gold/20 resize-none h-24"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-xs text-foreground/60 italic">
              Adding a note helps increase the chance of your connection being accepted
            </p>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="border-gold/20">
            Cancel
          </Button>
          <Button 
            onClick={handleConnect} 
            disabled={isSubmitting}
            className="bg-gold text-black hover:bg-gold/90"
          >
            {isSubmitting ? 'Sending...' : 'Send Connection Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
