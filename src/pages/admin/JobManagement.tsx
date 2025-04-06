
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
  EyeIcon, 
  Pencil, 
  Trash2, 
  Filter,
  ArrowUpDown,
  CheckCircle,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface Job {
  id: string;
  title: string;
  company: string;
  job_type: string;
  location: string;
  created_at: string;
  status: 'active' | 'draft' | 'closed' | 'expired';
  is_featured: boolean;
  is_verified: boolean;
}

const JobManagement = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('film_jobs')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setJobs(data || []);
        setFilteredJobs(data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load job data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [toast]);

  useEffect(() => {
    // Filter jobs based on search term
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = jobs.filter(
      job => 
        job.title.toLowerCase().includes(term) || 
        job.company.toLowerCase().includes(term) || 
        job.location.toLowerCase().includes(term) ||
        job.job_type.toLowerCase().includes(term)
    );
    
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Active</span>
        </Badge>;
      case 'draft':
        return <Badge variant="outline" className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
          </svg>
          <span>Draft</span>
        </Badge>;
      case 'closed':
        return <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
          <X className="h-3 w-3" />
          <span>Closed</span>
        </Badge>;
      case 'expired':
        return <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="3" x2="21" y1="9" y2="9" />
            <path d="m16 13-4 4-4-4" />
          </svg>
          <span>Expired</span>
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatSalary = (min?: number, max?: number, currency?: string, period?: string) => {
    if (!min && !max) return 'Not specified';
    
    const curr = currency || 'USD';
    const per = period || 'yearly';
    
    if (min && max) {
      return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()} (${per})`;
    }
    
    if (min) {
      return `${curr} ${min.toLocaleString()}+ (${per})`;
    }
    
    return `Up to ${curr} ${max!.toLocaleString()} (${per})`;
  };

  const handleVerifyJob = (id: string) => {
    // In a real implementation, this would update the job verification status in Supabase
    toast({
      title: "Job Verified",
      description: "The job has been verified and is now marked as trusted",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gold-gradient-text">Job Management</h1>
            <p className="text-muted-foreground">Manage job listings on the platform</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden md:inline">Filter</span>
            </Button>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Add Job</span>
            </Button>
          </div>
        </div>
        
        <Card className="border-gold/10 shadow-sm">
          <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>
                {!isLoading && 
                  `${filteredJobs.length} ${filteredJobs.length === 1 ? 'job' : 'jobs'} ${
                    searchTerm ? 'found' : 'total'
                  }`
                }
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
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
                    <TableHead>
                      <Button variant="ghost" size="sm" className="gap-1 -ml-2 font-medium">
                        Title
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-1">
                              {job.title}
                              {job.is_verified && (
                                <svg className="h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                  <path d="m9 12 2 2 4-4" />
                                </svg>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{job.job_type}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{job.location}</TableCell>
                          <TableCell>{getStatusBadge(job.status)}</TableCell>
                          <TableCell>
                            {job.is_featured ? (
                              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            )}
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
                                    <EyeIcon className="h-4 w-4" />
                                    <span>View</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex gap-2">
                                    <Pencil className="h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  {!job.is_verified && (
                                    <DropdownMenuItem 
                                      className="flex gap-2 text-blue-500 focus:text-blue-500"
                                      onClick={() => handleVerifyJob(job.id)}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      <span>Verify</span>
                                    </DropdownMenuItem>
                                  )}
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
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No jobs found matching your search.
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

export default JobManagement;
