
import { useState } from "react";
import { Job, JobSort } from "@/types/jobTypes";
import JobDetail from "./JobDetail";
import JobApplicationForm from "./JobApplicationForm";
import JobCard from "./JobCard";
import JobSortSelect from "./JobSortSelect";
import JobListSkeleton from "./JobListSkeleton";
import NoJobsFound from "./NoJobsFound";

interface JobResultsProps {
  jobs: Job[];
  isLoading: boolean;
  totalCount: number;
  savedJobs: string[];
  onSaveJob: (jobId: string) => void;
  onApplyJob: (jobId: string, data: any) => Promise<boolean>;
  onSort: (sort: JobSort) => void;
}

const JobResults = ({
  jobs,
  isLoading,
  totalCount,
  savedJobs,
  onSaveJob,
  onApplyJob,
  onSort,
}: JobResultsProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  
  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
  };
  
  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplyFormOpen(true);
  };
  
  const handleSubmitApplication = async (data: any) => {
    if (selectedJob) {
      const result = await onApplyJob(selectedJob.id, data);
      if (result) {
        setIsApplyFormOpen(false);
      }
      return result;
    }
    return false;
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-medium">
            {totalCount} {totalCount === 1 ? 'Job' : 'Jobs'} Found
            <span className="text-sm font-normal text-muted-foreground ml-2">Showing available opportunities</span>
          </h3>
          
          <JobSortSelect onSort={onSort} />
        </div>
        
        {isLoading ? (
          <JobListSkeleton />
        ) : jobs.length === 0 ? (
          <NoJobsFound />
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobs.includes(job.id)}
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
        onClose={() => setSelectedJob(null)}
        onApply={() => setIsApplyFormOpen(true)}
        isSaved={selectedJob ? savedJobs.includes(selectedJob.id) : false}
        onToggleSave={(jobId) => onSaveJob(jobId)} 
      />
      
      {/* Job Application Form */}
      {selectedJob && (
        <JobApplicationForm
          job={selectedJob}
          isOpen={isApplyFormOpen}
          onClose={() => setIsApplyFormOpen(false)}
          onSubmit={handleSubmitApplication}
        />
      )}
    </>
  );
};

export default JobResults;
