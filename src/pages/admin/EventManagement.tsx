
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Plus, Clock, Users, MapPin } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const EventManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock event data
  const events = [
    {
      id: "EVT-2024-001",
      title: "Annual Film Festival",
      location: "Los Angeles Convention Center",
      date: "2024-06-15",
      time: "10:00 AM - 8:00 PM",
      attendees: 450,
      status: "upcoming"
    },
    {
      id: "EVT-2024-002",
      title: "Casting Director Workshop",
      location: "New York Film Academy",
      date: "2024-06-22",
      time: "1:00 PM - 5:00 PM",
      attendees: 75,
      status: "upcoming"
    },
    {
      id: "EVT-2024-003",
      title: "Industry Networking Mixer",
      location: "The Roosevelt Hotel, Hollywood",
      date: "2024-05-30",
      time: "7:00 PM - 10:00 PM",
      attendees: 120,
      status: "upcoming"
    },
    {
      id: "EVT-2024-004",
      title: "Screenwriting Competition",
      location: "Online",
      date: "2024-07-01",
      time: "All Day",
      attendees: 200,
      status: "registration"
    },
    {
      id: "EVT-2024-005",
      title: "Makeup & SFX Workshop",
      location: "Atlanta Film Studios",
      date: "2024-05-10",
      time: "9:00 AM - 4:00 PM",
      attendees: 45,
      status: "completed"
    },
  ];

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "upcoming":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Upcoming</Badge>;
      case "registration":
        return <Badge className="bg-green-500 hover:bg-green-600">Registration Open</Badge>;
      case "completed":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Featured events for cards
  const upcomingEvents = events.filter(event => event.status === "upcoming");
  const featuredEvent = upcomingEvents[0];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold gold-gradient-text">Event Management</h1>
        <p className="text-muted-foreground">Create and manage industry events and gatherings.</p>
        
        <div className="flex flex-col gap-6">
          {/* Dashboard cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Events</CardTitle>
                <CardDescription>All scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{events.length}</span>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
                <CardDescription>Scheduled for the future</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">
                    {events.filter(event => event.status === "upcoming").length}
                  </span>
                  <div className="p-2 bg-blue-500/10 rounded-full">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Attendees</CardTitle>
                <CardDescription>Across all events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">
                    {events.reduce((acc, event) => acc + event.attendees, 0)}
                  </span>
                  <div className="p-2 bg-violet-500/10 rounded-full">
                    <Users className="h-6 w-6 text-violet-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Featured upcoming event */}
          {featuredEvent && (
            <Card className="bg-card shadow-md border border-gold/10">
              <CardHeader>
                <CardTitle>Featured Upcoming Event</CardTitle>
                <CardDescription>The next major industry event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-secondary/30 rounded-lg p-4 flex items-center justify-center md:w-1/3">
                    <Calendar className="h-12 w-12 text-gold opacity-80" />
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">{featuredEvent.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{featuredEvent.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{featuredEvent.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{featuredEvent.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{featuredEvent.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Edit Event</Button>
                <Button>View Details</Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Search and filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search events..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Filter by Date
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Events table */}
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
              <CardDescription>Manage industry events and workshops</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-mono text-xs">{event.id}</TableCell>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell>{event.attendees}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No events found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EventManagement;
