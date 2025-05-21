import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Define a basic Ticket type (you'll want a more comprehensive one)
interface Ticket {
  id: string;
  subject: string;
  userName: string;
  assignedTo: string;
  status: string;
  priority: string;
  createdAt: string;
  description?: string;
  // Add more fields as needed (e.g., messages, attachments)
}

const AdminTicketDetail = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dummy data for a single ticket (replace with API call)
  const fetchTicketDetails = (id: string): Promise<Ticket | null> => {
    // This is a placeholder function
    const dummyTickets: Ticket[] = [
       {
        id: 'TICKET-001',
        subject: 'Cannot log in to my account',
        userName: 'Alice Smith',
        assignedTo: 'Admin User 1',
        status: 'Open',
        priority: 'High',
        createdAt: '2023-10-26T10:00:00Z',
        description: 'The user is unable to log in to their account. They have tried resetting their password but it did not work.'
      },
      {
        id: 'TICKET-002',
        subject: 'Issue with posting a job',
        userName: 'Bob Johnson',
        assignedTo: 'Unassigned',
        status: 'In Progress',
        priority: 'Medium',
        createdAt: '2023-10-25T14:30:00Z',
        description: 'The user is receiving an error when trying to submit a new job posting. It seems to be related to the job description field.'
      },
       {
        id: 'TICKET-003',
        subject: 'Question about billing',
        userName: 'Charlie Brown',
        assignedTo: 'Admin User 2',
        status: 'Resolved',
        priority: 'Low',
        createdAt: '2023-10-24T09:15:00Z',
        description: 'User is asking for clarification on their recent invoice.'
      },
       {
        id: 'TICKET-004',
        subject: 'Feature request: Dark mode',
        userName: 'Diana Prince',
        assignedTo: 'Admin User 1',
        status: 'Closed',
        priority: 'Low',
        createdAt: '2023-10-23T11:00:00Z',
        description: 'User would like to request a dark mode feature for the application interface.'
      },
    ];
    return Promise.resolve(dummyTickets.find(t => t.id === id));
  };

  useEffect(() => {
    if (ticketId) {
      setLoading(true);
      fetchTicketDetails(ticketId)
        .then(data => {
          setTicket(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching ticket details:', err);
          setError('Failed to load ticket details.');
          setLoading(false);
        });
    }
  }, [ticketId]);

  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-center text-destructive">{error}</div>;
  }

  if (!ticket) {
    return <div className="text-center text-muted-foreground">Ticket not found.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ticket Details: {ticket.subject}</h1>
      <p className="text-muted-foreground">Ticket ID: {ticket.id}</p>

      {/* Ticket Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">Ticket Information</CardTitle>
          <Button onClick={() => console.log('Update button clicked')} size="sm">
            Update
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>User Name</Label>
            <p className="font-medium">{ticket.userName}</p>
          </div>
          <div>
            <Label>Created At</Label>
            <p className="font-medium">{new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <p className="font-medium">{ticket.description || 'No description provided.'}</p>
          </div>
           <div>
            <Label htmlFor="status">Status</Label>
             <Select value={ticket.status} onValueChange={(value) => console.log('Status changed:', value)}> {/* Add actual update logic */}
               <SelectTrigger>
                 <SelectValue placeholder="Select status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="Open">Open</SelectItem>
                 <SelectItem value="In Progress">In Progress</SelectItem>
                 <SelectItem value="Resolved">Resolved</SelectItem>
                 <SelectItem value="Closed">Closed</SelectItem>
               </SelectContent>
             </Select>
          </div>
           <div>
            <Label htmlFor="priority">Priority</Label>
             <Select value={ticket.priority} onValueChange={(value) => console.log('Priority changed:', value)}> {/* Add actual update logic */}
               <SelectTrigger>
                 <SelectValue placeholder="Select priority" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="Low">Low</SelectItem>
                 <SelectItem value="Medium">Medium</SelectItem>
                 <SelectItem value="High">High</SelectItem>
               </SelectContent>
             </Select>
          </div>
           <div>
            <Label htmlFor="assignedTo">Assigned To</Label>
             <Select value={ticket.assignedTo} onValueChange={(value) => console.log('Assigned to changed:', value)}> {/* Add actual update logic */}
               <SelectTrigger>
                 <SelectValue placeholder="Select assignee" />
               </SelectTrigger>
               <SelectContent>
                 {/* Replace with actual list of assignable users */}
                 <SelectItem value="Admin User 1">Admin User 1</SelectItem>
                 <SelectItem value="Admin User 2">Admin User 2</SelectItem>
                 <SelectItem value="Unassigned">Unassigned</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </CardContent>
      </Card>

      {/* Chat/Comment Thread */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Log</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for messages/comments */}
          <p className="text-muted-foreground">[Chat/Comment thread will be implemented here]</p>
           {/* Placeholder for adding a new comment */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="new-comment">Add Comment</Label>
            <Textarea id="new-comment" placeholder="Type your comment here..." />
            <Button size="sm">Post Comment</Button>
          </div>
        </CardContent>
      </Card>

      {/* File Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for viewing/uploading attachments */}
          <p className="text-muted-foreground">[File attachment management will be implemented here]</p>
           <div className="mt-4 space-y-2">
            <Label htmlFor="upload-attachment">Upload Attachment</Label>
            <Input id="upload-attachment" type="file" />
             <Button size="sm">Upload File</Button>
          </div>
        </CardContent>
      </Card>

      {/* History */}      
       <Card>
        <CardHeader>
          <CardTitle>Ticket History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for history log */}
          <p className="text-muted-foreground">[Ticket history log will be implemented here]</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTicketDetail; 