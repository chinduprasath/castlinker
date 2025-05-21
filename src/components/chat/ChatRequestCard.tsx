
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ChatRequestCardProps {
  senderName: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const ChatRequestCard = ({ senderName, onAccept, onDecline }: ChatRequestCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-background border-gold/20">
      <CardHeader>
        <CardTitle className="text-gold">New Chat Request</CardTitle>
        <CardDescription>Someone wants to connect with you</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg">
          Hey, you got a request from <span className="font-semibold">{senderName}</span>
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Button 
          variant="outline" 
          className="border-red-500 hover:bg-red-500/10 text-red-500"
          onClick={onDecline}
        >
          <X className="mr-2 h-4 w-4" />
          Not Interested
        </Button>
        <Button 
          className="bg-gold hover:bg-gold/80 text-black"
          onClick={onAccept}
        >
          <Check className="mr-2 h-4 w-4" />
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChatRequestCard;
