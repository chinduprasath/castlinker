
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MessageCircle } from 'lucide-react';
import { TalentProfile } from '@/hooks/useTalentDirectory';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type MessageDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: TalentProfile | null;
  onSendMessage: (talentId: string, message: string) => Promise<{ success: boolean }>;
};

export function MessageDialog({ isOpen, onClose, profile, onSendMessage }: MessageDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ""
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!profile) return;
    
    setIsSubmitting(true);
    
    try {
      const { success } = await onSendMessage(profile.id, values.message);
      
      if (success) {
        form.reset();
        toast({
          title: "Message sent",
          description: `Your message to ${profile.name} has been sent successfully.`,
        });
        onClose();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!profile) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-cinematic-dark border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-gold" />
            Message {profile.name}
          </DialogTitle>
          <DialogDescription>
            Send a direct message to start a conversation about potential collaborations.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={`Hello ${profile.name}, I'm interested in working with you...`} 
                      {...field} 
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gold/20"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gold hover:bg-gold/90 text-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
