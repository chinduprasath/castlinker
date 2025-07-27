import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { fetchJobsByUser } from '@/services/jobsService';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoreHorizontal, Users, Pencil, Trash, Eye, Bookmark } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import JobCreateForm from '@/components/jobs/JobCreateForm';
import { updateJob, deleteJob } from '@/services/jobsService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useJobsData } from '@/hooks/useJobsData';
import SavedJobCard from '@/components/jobs/SavedJobCard';
import JobDetail from '@/components/jobs/JobDetail';
import JobApplicationForm from '@/components/jobs/JobApplicationForm';

const ManageJobsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedLoading, setAppliedLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editJob, setEditJob] = useState<any | null>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const { toast } = useToast();
  
  // Use jobs data hook for saved jobs functionality
  const { 
    jobs: allJobs, 
    savedJobs, 
    toggleSaveJob, 
    applyForJob,
    isLoading: jobsLoading 
  } = useJobsData();

  useEffect(() => {
    const loadJobs = async () => {
      if (!user) return;
      setLoading(true);
      const userJobs = await fetchJobsByUser(user.id);
      setJobs(userJobs);
      setLoading(false);
    };
    loadJobs();
  }, [user]);

  useEffect(() => {
    const loadAppliedJobs = async () => {
      if (!user) return;
      setAppliedLoading(true);
      // Mock data for applied jobs - in real implementation, this would fetch from a service
      const mockAppliedJobs = [
        {
          id: 'job-1',
          title: 'Senior Frontend Developer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          applied_date: new Date('2024-01-15'),
          application_status: 'Interview',
        },
        {
          id: 'job-2',
          title: 'UI/UX Designer',
          company: 'Design Studio',
          location: 'New York, NY',
          applied_date: new Date('2024-01-10'),
          application_status: 'Pending',
        },
      ];
      setAppliedJobs(mockAppliedJobs);
      setAppliedLoading(false);
    };
    loadAppliedJobs();
  }, [user]);

  const formatJobId = (id: string, idx: number) => {
    // Use actual job id if available, else fallback to JB- + 6 digit index
    if (id && id.startsWith('JB-')) return id;
    return `JB-${(idx + 1).toString().padStart(6, '0')}`;
  };

  const handleShowDetails = (job: any) => {
    navigate(`/manage/jobs/${job.id}`);
  };

  const handleEditJob = (job: any) => {
    setEditJob(job);
    setShowEditDialog(true);
  };

  const handleUpdateJob = async (jobId: string, jobData: any) => {
    const success = await updateJob(jobId, jobData);
    if (success) {
      toast({ title: 'Job updated', description: 'The job has been updated.' });
      setJobs(jobs.map(j => (j.id === jobId ? { ...j, ...jobData } : j)));
      setShowEditDialog(false);
      setEditJob(null);
    } else {
      toast({ title: 'Error', description: 'Failed to update job.', variant: 'destructive' });
    }
  };

  const handleDeleteJob = async (job: any) => {
    const success = await deleteJob(job.id);
    if (success) {
      toast({ title: 'Job deleted', description: 'The job has been deleted.' });
      setJobs(jobs.filter(j => j.id !== job.id));
    } else {
      toast({ title: 'Error', description: 'Failed to delete job.', variant: 'destructive' });
    }
  };

  const handleRemoveSavedJob = async (jobId: string) => {
    await toggleSaveJob(jobId);
  };

  const handleViewJobDetails = (job: any) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };

  const handleApplyForJob = (job: any) => {
    setSelectedJob(job);
    setIsApplicationOpen(true);
  };

  const handleJobApplication = async (jobId: string, application: any) => {
    const success = await applyForJob(jobId, application);
    if (success) {
      setIsApplicationOpen(false);
    }
    return success;
  };

  // Get saved jobs data
  const savedJobsData = allJobs.filter(job => savedJobs.includes(job.id));

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Manage Your Jobs</h1>
      <Tabs defaultValue="created" className="w-full">
        <TabsList>
          <TabsTrigger value="created">Created</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="created">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">Loading...</TableCell>
                      </TableRow>
                    ) : jobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">No jobs found.</TableCell>
                      </TableRow>
                    ) : jobs.map((job, idx) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          <button
                            className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
                            onClick={() => handleShowDetails(job)}
                            style={{ background: 'none' }}
                          >
                            {formatJobId(job.id, idx)}
                          </button>
                        </TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.company || '-'}</TableCell>
                        <TableCell>{job.category || '-'}</TableCell>
                        <TableCell>{job.location || '-'}</TableCell>
                        <TableCell>{job.created_at ? new Date(job.created_at.seconds ? job.created_at.seconds * 1000 : job.created_at).toISOString().slice(0, 10) : '-'}</TableCell>
                        <TableCell><Badge variant="secondary">{job.status || 'active'}</Badge></TableCell>
                        <TableCell className="text-center"><Users className="w-4 h-4 inline-block mr-1 align-middle" />{job.applications_count || 0}</TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => handleEditJob(job)}><Pencil className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteJob(job)}><Trash className="w-4 h-4 text-red-500" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applied">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Application Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appliedLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
                      </TableRow>
                    ) : appliedJobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">No applied jobs found.</TableCell>
                      </TableRow>
                    ) : appliedJobs.map((job, idx) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">
                          <button
                            className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
                            onClick={() => navigate(`/jobs/${job.id}`)}
                            style={{ background: 'none' }}
                          >
                            {formatJobId(job.id, idx)}
                          </button>
                        </TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.applied_date.toISOString().slice(0, 10)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            job.application_status === 'Interview' ? 'default' :
                            job.application_status === 'Pending' ? 'secondary' :
                            job.application_status === 'Selected' ? 'default' :
                            'destructive'
                          }>
                            {job.application_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => navigate(`/jobs/${job.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Job
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobsLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">Loading...</TableCell>
                      </TableRow>
                    ) : savedJobsData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          <div className="text-muted-foreground">
                            <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No saved jobs yet</p>
                            <p className="text-sm">Jobs you save will appear here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      savedJobsData.map((job, idx) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">
                            <button
                              className="text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0"
                              onClick={() => handleViewJobDetails(job)}
                              style={{ background: 'none' }}
                            >
                              {formatJobId(job.id, idx)}
                            </button>
                          </TableCell>
                          <TableCell>{job.title}</TableCell>
                          <TableCell>{job.company || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{(job as any).category || '-'}</Badge>
                          </TableCell>
                          <TableCell>{job.location || '-'}</TableCell>
                          <TableCell>{job.created_at ? new Date(typeof job.created_at === 'string' ? job.created_at : (job.created_at as any).seconds * 1000).toISOString().slice(0, 10) : '-'}</TableCell>
                          <TableCell>
                            <Badge variant="default">active</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>0</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button size="icon" variant="ghost" onClick={() => handleViewJobDetails(job)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleRemoveSavedJob(job.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Job Dialog */}
      {editJob && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <JobCreateForm
              onJobCreated={() => {
                setShowEditDialog(false);
                setEditJob(null);
              }}
              initialValues={editJob}
              onUpdate={handleUpdateJob}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetail
          job={selectedJob}
          isSaved={savedJobs.includes(selectedJob.id)}
          onToggleSave={handleRemoveSavedJob}
          onApply={() => handleApplyForJob(selectedJob)}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}

      {/* Job Application Form */}
      {selectedJob && (
        <JobApplicationForm
          job={selectedJob}
          isOpen={isApplicationOpen}
          onClose={() => setIsApplicationOpen(false)}
          onSubmit={(application) => handleJobApplication(selectedJob.id, application)}
        />
      )}
    </div>
  );
};

export default ManageJobsPage; 