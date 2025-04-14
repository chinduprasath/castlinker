
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { TalentProfile } from '@/types/talent';

interface ConnectDialogProps {
  talent: TalentProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectDialog({ talent, isOpen, onClose }: ConnectDialogProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleConnect = async () => {
    if (!talent) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would send the connection request to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
          <DialogTitle>Connect with {talent?.name}</DialogTitle>
          <DialogDescription>
            Send a connection request to collaborate with this {talent?.role.toLowerCase()}
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
