
import { useState } from "react";
import { ChevronDown, Bookmark, BookmarkCheck, MapPin, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Job, JobSort } from "@/hooks/useJobsData";
import { useAuth } from "@/contexts/AuthContext";
import JobDetail from "./JobDetail";
import JobApplicationForm from "./JobApplicationForm";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { user } = useAuth();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
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

  // Helper function for formatting salary
  const formatSalary = (job: Job) => {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `$${job.salary_min.toLocaleString()}+`;
    } else if (job.salary_max) {
      return `Up to $${job.salary_max.toLocaleString()}`;
    }
    return "Not specified";
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let sort: JobSort;
    
    switch(value) {
      case "date":
        sort = { field: "created_at", direction: "desc" };
        break;
      case "salary":
        sort = { field: "salary_max", direction: "desc" };
        break;
      default:
        sort = { field: "relevance", direction: "desc" };
    }
    
    onSort(sort);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-medium">
            {totalCount} {totalCount === 1 ? 'Job' : 'Jobs'} Found
            <span className="text-sm font-normal text-muted-foreground ml-2">Showing available opportunities</span>
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="text-sm mr-2">Sort by:</span>
            <select
              className="bg-background border border-input rounded-md px-3 py-1 text-sm shadow-sm focus:border-gold focus:outline-none"
              onChange={handleSortChange}
              defaultValue="relevance"
            >
              <option value="relevance">Most Relevant</option>
              <option value="date">Most Recent</option>
              <option value="salary">Highest Pay</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <Card key={i} className="border-border/40 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex flex-wrap gap-3">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <Card className="border-border/40 bg-background">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                No jobs match your current search criteria. Try adjusting your filters or search terms.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              const isFeatured = job.is_featured;
              const isRemote = job.location_type === 'Remote';
              
              return (
                <Card 
                  key={job.id} 
                  className={`border-border/40 overflow-hidden transition-all hover:shadow-md hover:border-gold/20 cursor-pointer ${
                    isFeatured ? 'border-l-4 border-l-gold' : ''
                  }`}
                  onClick={() => handleJobClick(job)}
                >
                  <CardContent className="p-0">
                    {isFeatured && (
                      <div className="bg-gold/10 py-1 px-4">
                        <span className="text-gold text-xs font-medium">Featured Opportunity</span>
                      </div>
                    )}
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-xl">{job.title}</h3>
                          <p className="text-muted-foreground">{job.company}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:text-gold"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSaveJob(job.id);
                          }}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="h-5 w-5 text-gold" />
                          ) : (
                            <Bookmark className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        {job.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                            {isRemote && <Badge variant="outline" className="ml-1">Remote</Badge>}
                          </div>
                        )}
                        
                        {job.created_at && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Posted {formatDate(job.created_at)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatSalary(job)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm line-clamp-2">{job.description}</p>
                      
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-muted text-foreground">{skill}</Badge>
                          ))}
                          {job.requirements.length > 3 && (
                            <Badge variant="secondary" className="bg-muted text-foreground">+{job.requirements.length - 3} more</Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-gold/30 text-gold hover:bg-gold/5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJobClick(job);
                          }}
                        >
                          View Details
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                        
                        {user && (
                          <Button 
                            size="sm" 
                            className="bg-gold hover:bg-gold/90 text-white dark:text-black"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyClick(job);
                            }}
                          >
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
