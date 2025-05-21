import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: any) => void; // Replace any with a proper type later
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Low');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Placeholder submission logic
    console.log('Submitting ticket:', { subject, description, priority, attachments });

    // In a real app, you would send this data to your backend/API
    // await yourApiCall({ subject, description, priority, attachments });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    onClose(); // Close modal after submission
    // You might want to refresh the ticket list here in the parent component
  };

  // Close modal if pressing Escape or clicking outside
  // This is often handled by the Dialog component itself, but can be added here if needed

  return (
    <Dialog open={isOpen} onOpenChange={onClose}> {/* Use onOpenChange to handle closing */} 
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Fill in the details for the new support ticket.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">Priority</Label>
             <Select value={priority} onValueChange={setPriority}>
               <SelectTrigger className="col-span-3">
                 <SelectValue placeholder="Select priority" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="Low">Low</SelectItem>
                 <SelectItem value="Medium">Medium</SelectItem>
                 <SelectItem value="High">High</SelectItem>
               </SelectContent>
             </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attachments" className="text-right">Attachments</Label>
            <Input id="attachments" type="file" multiple onChange={handleFileChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
             {isSubmitting ? 'Creating...' : 'Create Ticket'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal; 