import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    </div>
  );
};

export default ManageJobsPage; 