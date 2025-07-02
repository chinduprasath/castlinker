import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchJobsByUser } from '@/services/jobsService';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Users, Pencil, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import JobCreateForm from '@/components/jobs/JobCreateForm';
import { updateJob, deleteJob } from '@/services/jobsService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const ManageJobsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editJob, setEditJob] = useState<any | null>(null);
  const { toast } = useToast();

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

  const formatJobId = (id: string, idx: number) => {
    // Use actual job id if available, else fallback to JB- + 6 digit index
    if (id && id.startsWith('JB-')) return id;
    return `JB-${(idx + 1).toString().padStart(6, '0')}`;
  };

  const handleShowDetails = (job: any) => {
    setSelectedJob(job);
    setShowJobDialog(true);
  };

  const handleEditJob = (job: any) => {
    setShowJobDialog(false);
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
      setShowJobDialog(false);
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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Your Job Listings</h1>
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

      {/* Job Details Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>
              {selectedJob && (
                <div className="space-y-2 mt-2">
                  <div><strong>Title:</strong> {selectedJob.title}</div>
                  <div><strong>Company:</strong> {selectedJob.company}</div>
                  <div><strong>Description:</strong> {selectedJob.description}</div>
                  <div><strong>Category:</strong> {selectedJob.role_category || '-'}</div>
                  <div><strong>Type:</strong> {selectedJob.job_type || '-'}</div>
                  <div><strong>Experience Level:</strong> {selectedJob.experience_level || '-'}</div>
                  <div><strong>Location:</strong> {selectedJob.location || '-'}</div>
                  <div><strong>Location Type:</strong> {selectedJob.location_type || '-'}</div>
                  <div><strong>Salary:</strong> {selectedJob.salary_min || '-'} - {selectedJob.salary_max || '-'} {selectedJob.salary_currency || ''} ({selectedJob.salary_period || ''})</div>
                  <div><strong>Application Deadline:</strong> {selectedJob.application_deadline || '-'}</div>
                  <div><strong>Status:</strong> {selectedJob.status || '-'}</div>
                  <div><strong>Posted Date:</strong> {selectedJob.created_at ? new Date(selectedJob.created_at.seconds ? selectedJob.created_at.seconds * 1000 : selectedJob.created_at).toLocaleString() : '-'}</div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      {editJob && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <JobCreateForm
              onJobCreated={() => {
                setShowEditDialog(false);
                setEditJob(null);
                setShowJobDialog(false);
              }}
              initialValues={editJob}
              onUpdate={handleUpdateJob}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ManageJobsPage; 