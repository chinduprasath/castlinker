import { useState, useEffect } from 'react';
import { db } from '@/integrations/firebase/client';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Tickets = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [subject, setSubject] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchTickets = async () => {
      setLoading(true);
      const q = query(
        collection(db, 'tickets'),
        where('userId', '==', user.id),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchTickets();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim() || !message.trim()) return;
    setSubmitting(true);
    let fileUrl = '';
    // File upload logic (if you have storage integration)
    // For now, just skip file upload
    await addDoc(collection(db, 'tickets'), {
      userId: user.id,
      userName: user.name,
      subject,
      message,
      fileUrl,
      status: 'Open',
      createdAt: Timestamp.now(),
      progress: 'New'
    });
    setSubject('');
    setMessage('');
    setFile(null);
    setSubmitting(false);
    setSuccessMsg('Ticket created successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
    // Refresh tickets
    const q = query(
      collection(db, 'tickets'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-2 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Create Ticket */}
        <div className="md:w-1/2 w-full">
          <div className="bg-white dark:bg-card rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Submit a New Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={e => { setSubject(e.target.value); setSuccessMsg(''); }}
                  required
                  placeholder="Enter ticket subject..."
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={e => { setMessage(e.target.value); setSuccessMsg(''); }}
                  required
                  rows={4}
                  placeholder="Describe your issue or request..."
                />
              </div>
              <div>
                <Label htmlFor="file">Attach File (optional)</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf,.doc,.docx,.txt"
                />
              </div>
              <Button type="submit" disabled={submitting || !message.trim()} className="w-full">Submit Ticket</Button>
              {successMsg && (
                <div className="text-green-600 text-sm mt-2">{successMsg}</div>
              )}
            </form>
          </div>
        </div>
        {/* Right: Tickets List */}
        <div className="md:w-1/2 w-full">
          <div className="bg-white dark:bg-card rounded-xl shadow-lg p-6 h-full">
            <h2 className="text-2xl font-bold mb-4">Your Tickets</h2>
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-muted-foreground">No tickets found.</div>
            ) : (
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <div className="font-semibold truncate">{ticket.subject || '(No Subject)'}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">{ticket.message}</div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Status: <span className="font-medium text-black dark:text-white">{ticket.status}</span></span>
                      <span>Progress: <span className="font-medium text-black dark:text-white">{ticket.progress || 'N/A'}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Ticket Details Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg">
          {selectedTicket && (
            <div>
              <DialogHeader>
                <DialogTitle>Ticket Details</DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <div className="mb-2"><span className="font-semibold">Subject:</span> {selectedTicket.subject || '(No Subject)'}</div>
                <div className="mb-2"><span className="font-semibold">Message:</span> {selectedTicket.message}</div>
                {selectedTicket.fileUrl && <div className="mb-2"><a href={selectedTicket.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Attachment</a></div>}
                <div className="mb-2">Status: <span className="font-medium text-black dark:text-white">{selectedTicket.status}</span></div>
                <div className="mb-2">Progress: <span className="font-medium text-black dark:text-white">{selectedTicket.progress || 'N/A'}</span></div>
                <div className="mb-2">Created: {selectedTicket.createdAt?.toDate ? selectedTicket.createdAt.toDate().toLocaleString() : ''}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tickets; 