
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { Search, Plus, Filter, CheckCircle, Clock, XCircle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const JobManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock job data
  const jobs = [
    {
      id: "JOB-2024-001",
      title: "Lead Actor for Feature Film",
      company: "Universal Studios",
      location: "Los Angeles, CA",
      postedDate: "2024-05-15",
      status: "active",
      applications: 24
    },
    {
      id: "JOB-2024-002",
      title: "Supporting Actress",
      company: "Paramount Pictures",
      location: "New York, NY",
      postedDate: "2024-05-12",
      status: "active",
      applications: 18
    },
    {
      id: "JOB-2024-003",
      title: "Voice Actor for Animation",
      company: "Pixar",
      location: "Remote",
      postedDate: "2024-05-10",
      status: "pending",
      applications: 0
    },
    {
      id: "JOB-2024-004",
      title: "Stunt Double",
      company: "Warner Bros",
      location: "Atlanta, GA",
      postedDate: "2024-05-05",
      status: "closed",
      applications: 12
    },
    {
      id: "JOB-2024-005",
      title: "Director of Photography",
      company: "Netflix Productions",
      location: "Vancouver, BC",
      postedDate: "2024-05-03",
      status: "active",
      applications: 9
    },
  ];

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending Review</Badge>;
      case "closed":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold gold-gradient-text">Job Management</h1>
        <p className="text-muted-foreground">Manage job listings and applications on the platform.</p>
        
        <div className="flex flex-col gap-6">
          {/* Dashboard cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Jobs</CardTitle>
                <CardDescription>All job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{jobs.length}</span>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Jobs</CardTitle>
                <CardDescription>Currently active listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">
                    {jobs.filter(job => job.status === "active").length}
                  </span>
                  <div className="p-2 bg-green-500/10 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Review</CardTitle>
                <CardDescription>Jobs awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">
                    {jobs.filter(job => job.status === "pending").length}
                  </span>
                  <div className="p-2 bg-amber-500/10 rounded-full">
                    <Clock className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Search and filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search jobs..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Job
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Jobs table */}
          <Card>
            <CardHeader>
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>Manage all job postings across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-mono text-xs">{job.id}</TableCell>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.postedDate}</TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>{job.applications}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-destructive">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No jobs found. Try adjusting your search.
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

export default JobManagement;
