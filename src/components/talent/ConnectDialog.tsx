import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { TalentProfile } from '@/types/talentTypes';

interface ConnectDialogProps {
  talent?: TalentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (talent: TalentProfile, message: string) => boolean | Promise<boolean>;
}

export function ConnectDialog({ talent, isOpen, onClose, onConnect }: ConnectDialogProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleConnect = async () => {
    if (!talent || !onConnect) return;
    
    setIsLoading(true);
    
    try {
      await onConnect(talent, message);
      
      // Success
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending connection request:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect with {talent?.full_name || 'Talent'}</DialogTitle>
          <DialogDescription>
            Send a connection request to collaborate with this {talent?.profession_type?.toLowerCase() || 'professional'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Include a brief message explaining why you'd like to connect:
          </p>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="I'd love to connect regarding a potential collaboration..."
            className="min-h-32"
          />
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
