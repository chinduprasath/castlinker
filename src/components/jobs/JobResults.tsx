
import { useState, memo, useCallback } from "react";
import { Job, JobSort } from "@/types/jobTypes";
import JobDetail from "./JobDetail";
import JobApplicationForm from "./JobApplicationForm";
import JobCard from "./JobCard";
import JobSortSelect from "./JobSortSelect";
import JobListSkeleton from "./JobListSkeleton";
import NoJobsFound from "./NoJobsFound";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobResultsProps {
  jobs: Job[];
  isLoading: boolean;
  error?: string | null;
  totalCount: number;
  savedJobs: string[];
  onSaveJob: (jobId: string) => void;
  onApplyJob: (jobId: string, data: any) => Promise<boolean>;
  onSort: (sort: JobSort) => void;
  refetchJobs?: () => Promise<void>;
}

const JobResults = memo(({
  jobs,
  isLoading,
  error,
  totalCount,
  savedJobs,
  onSaveJob,
  onApplyJob,
  onSort,
  refetchJobs,
}: JobResultsProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  
  const handleJobClick = useCallback((job: Job) => {
    setSelectedJob(job);
  }, []);
  
  const handleApplyClick = useCallback((job: Job) => {
    setSelectedJob(job);
    setIsApplyFormOpen(true);
  }, []);
  
  const handleSubmitApplication = useCallback(async (data: any) => {
    if (selectedJob) {
      const result = await onApplyJob(selectedJob.id, data);
      if (result) {
        setIsApplyFormOpen(false);
      }
      return result;
    }
    return false;
  }, [selectedJob, onApplyJob]);

  const handleCloseDetail = useCallback(() => {
    setSelectedJob(null);
  }, []);

  const handleCloseApplyForm = useCallback(() => {
    setIsApplyFormOpen(false);
  }, []);

  const handleOpenApplyForm = useCallback(() => {
    setIsApplyFormOpen(true);
  }, []);

  // Avoid unnecessary calculation on each render
  const isSaved = useCallback((jobId: string) => {
    return savedJobs.includes(jobId);
  }, [savedJobs]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-medium">
            {error ? 'Job Search' : `${totalCount} ${totalCount === 1 ? 'Job' : 'Jobs'} Found`}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {error ? 'An error occurred' : 'Showing available opportunities'}
            </span>
          </h3>
          
          <JobSortSelect onSort={onSort} />
        </div>
        
        {error ? (
          <Alert variant="destructive" className="animate-none">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error fetching jobs</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            {refetchJobs && (
              <Button 
                onClick={() => refetchJobs()} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                <RefreshCcw className="mr-1 h-4 w-4" />
                Try Again
              </Button>
            )}
          </Alert>
        ) : isLoading ? (
          <JobListSkeleton count={3} />
        ) : jobs.length === 0 ? (
          <NoJobsFound />
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={isSaved(job.id)}
                onSaveClick={onSaveJob}
                onViewDetailsClick={handleJobClick}
                onApplyClick={handleApplyClick}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Job Detail Modal */}
      <JobDetail
        job={selectedJob}
        isOpen={!!selectedJob && !isApplyFormOpen}
        onClose={handleCloseDetail}
        onApply={handleOpenApplyForm}
        isSaved={selectedJob ? isSaved(selectedJob.id) : false}
        onToggleSave={onSaveJob} 
      />
      
      {/* Job Application Form */}
      {selectedJob && (
        <JobApplicationForm
          job={selectedJob}
          isOpen={isApplyFormOpen}
          onClose={handleCloseApplyForm}
          onSubmit={handleSubmitApplication}
        />
      )}
    </>
  );
});

JobResults.displayName = "JobResults";

export default JobResults;
