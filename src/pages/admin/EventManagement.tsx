
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Search, 
  PlusCircle, 
  Calendar, 
  Pencil, 
  Trash2, 
  MapPin,
  Clock,
  CalendarPlus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_by: string;
}

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('start_date', { ascending: true });
        
        if (error) throw error;
        
        setEvents(data || []);
        setFilteredEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: "Error",
          description: "Failed to load event data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [toast]);

  useEffect(() => {
    // Filter events based on search term
    if (!searchTerm.trim()) {
      setFilteredEvents(events);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = events.filter(
      event => 
        event.title.toLowerCase().includes(term) || 
        event.description.toLowerCase().includes(term)
    );
    
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatusBadge = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now > end) {
      return <Badge className="bg-slate-500 hover:bg-slate-600">Ended</Badge>;
    }
    
    if (now >= start && now <= end) {
      return <Badge className="bg-green-500 hover:bg-green-600">In Progress</Badge>;
    }
    
    // Calculate days until event
    const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 7) {
      return <Badge className="bg-amber-500 hover:bg-amber-600">Upcoming</Badge>;
    }
    
    return <Badge variant="outline">Scheduled</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gold-gradient-text">Event Management</h1>
            <p className="text-muted-foreground">Manage industry events and workshops</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="gap-1">
              <CalendarPlus className="h-4 w-4" />
              <span>Add Event</span>
            </Button>
          </div>
        </div>
        
        <Card className="border-gold/10 shadow-sm">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Events</CardTitle>
              <CardDescription>
                {!isLoading && 
                  `${filteredEvents.length} ${filteredEvents.length === 1 ? 'event' : 'events'} ${
                    searchTerm ? 'found' : 'scheduled'
                  }`
                }
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-9 bg-background/60 w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                              {event.title}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {event.description}
                            </p>
                          </TableCell>
                          <TableCell>{getEventStatusBadge(event.start_date, event.end_date)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(event.start_date)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(event.end_date)}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="flex gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>View</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex gap-2">
                                    <Pencil className="h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>Location</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="flex gap-2 text-red-500 focus:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No events found matching your search.
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EventManagement;
