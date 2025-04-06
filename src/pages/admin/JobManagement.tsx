import { useState, useEffect } from "react";
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
import { 
  Search, 
  Plus, 
  Filter, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Edit,
  AlertCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/AdminLayout";
import JobForm from "@/components/admin/JobForm";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/hooks/useJobsData";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { seedJobsData } from "@/utils/seedJobsData";

const JobManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [pendingJobs, setPendingJobs] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const initializeData = async () => {
      await seedJobsData();
      fetchJobs();
    };
    
    initializeData();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase
        .from('film_jobs')
        .select('*') as any);
        
      if (error) throw error;
      
      const jobsData = data as Job[];
      setJobs(jobsData);
      setFilteredJobs(jobsData);
      
      setTotalJobs(jobsData.length);
      setActiveJobs(jobsData.filter(job => job.status === 'active').length);
      setPendingJobs(jobsData.filter(job => job.status === 'pending').length);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to load jobs"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => 
        job.title?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.id?.toLowerCase().includes(query)
      );
      setFilteredJobs(filtered);
    }
  };
  
  const handleJobSubmit = async (jobData: Partial<Job>) => {
    try {
      if (currentJob) {
        const { error } = await (supabase
          .from('film_jobs')
          .update(jobData)
          .eq('id', currentJob.id) as any);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Job updated successfully"
        });
      } else {
        const { error } = await (supabase
          .from('film_jobs')
          .insert([jobData as any]) as any);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Job created successfully"
        });
      }
      
      fetchJobs();
      setIsJobFormOpen(false);
      setCurrentJob(null);
    } catch (error: any) {
      console.error("Error saving job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save job"
      });
    }
  };
  
  const handleEditJob = (job: Job) => {
    setCurrentJob(job);
    setIsJobFormOpen(true);
  };
  
  const handleDeleteJob = async () => {
    if (!currentJob) return;
    
    try {
      const { error } = await (supabase
        .from('film_jobs')
        .delete()
        .eq('id', currentJob.id) as any);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Job deleted successfully"
      });
      
      fetchJobs();
      setIsDeleteDialogOpen(false);
      setCurrentJob(null);
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete job"
      });
    }
  };
  
  const handleToggleJobStatus = async (job: Job) => {
    const newStatus = job.status === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await (supabase
        .from('film_jobs')
        .update({ status: newStatus })
        .eq('id', job.id) as any);
        
      if (error) throw error;
      
      toast({
        title: "Success", 
        description: `Job ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      });
      
      fetchJobs();
    } catch (error: any) {
      console.error("Error updating job status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update job status"
      });
    }
  };

  const handleApproveJob = async (job: Job) => {
    try {
      const { error } = await (supabase
        .from('film_jobs')
        .update({ status: 'active' })
        .eq('id', job.id) as any);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Job approved successfully"
      });
      
      fetchJobs();
    } catch (error: any) {
      console.error("Error approving job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to approve job"
      });
    }
  };
  
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toISOString().split('T')[0];
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Pending Review</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const generateJobId = (id: string, company: string) => {
    if (!id) return 'N/A';
    return `JOB-${company?.substring(0, 3).toUpperCase() || 'XXX'}-${id.substring(0, 5).toUpperCase()}`;
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gold-gradient-text">Job Management</h1>
          <p className="text-muted-foreground">Manage job listings and applications on the platform.</p>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Jobs</CardTitle>
                <CardDescription>All job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{totalJobs}</span>
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
                  <span className="text-3xl font-bold">{activeJobs}</span>
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
                  <span className="text-3xl font-bold">{pendingJobs}</span>
                  <div className="p-2 bg-amber-500/10 rounded-full">
                    <Clock className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search jobs..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button variant="outline" size="sm" className="w-full md:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setCurrentJob(null);
                      setIsJobFormOpen(true);
                    }}
                    className="bg-gold hover:bg-gold/90 text-black w-full md:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Job
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>Manage all job postings across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          Loading jobs...
                        </TableCell>
                      </TableRow>
                    ) : filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-mono text-xs">
                            {generateJobId(job.id, job.company || '')}
                          </TableCell>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>{formatDate(job.created_at)}</TableCell>
                          <TableCell>{getStatusBadge(job.status || 'active')}</TableCell>
                          <TableCell>
                            {Math.floor(Math.random() * 30)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditJob(job)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              {job.status === 'pending' ? (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-green-500" 
                                  onClick={() => handleApproveJob(job)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className={job.status === 'active' ? "text-amber-500" : "text-green-500"}
                                  onClick={() => handleToggleJobStatus(job)}
                                >
                                  {job.status === 'active' ? <Clock className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive"
                                onClick={() => {
                                  setCurrentJob(job);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No jobs found. Try adjusting your search or create a new job.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <JobForm 
        isOpen={isJobFormOpen}
        onClose={() => {
          setIsJobFormOpen(false);
          setCurrentJob(null);
        }}
        onSubmit={handleJobSubmit}
        job={currentJob}
      />
      
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCurrentJob(null);
        }}
        onConfirm={handleDeleteJob}
        title="Delete Job"
        description={`Are you sure you want to delete the job "${currentJob?.title}"? This action cannot be undone.`}
      />
    </AdminLayout>
  );
};

export default JobManagement;
