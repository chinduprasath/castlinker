
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Clock, ExternalLink, MapPin, Star, DollarSign, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Job, JobSort } from "@/hooks/useJobsData";
import JobDetail from "./JobDetail";
import JobApplicationForm from "./JobApplicationForm";

interface JobResultsProps {
  jobs: Job[];
  isLoading: boolean;
  totalCount: number;
  savedJobs: string[];
  onSaveJob: (jobId: string) => void;
  onApplyJob: (jobId: string, application: any) => Promise<boolean>;
  onSort: (sort: JobSort) => void;
}

const JobResults = ({ 
  jobs, 
  isLoading, 
  totalCount, 
  savedJobs, 
  onSaveJob, 
  onApplyJob, 
  onSort 
}: JobResultsProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  
  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };
  
  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationOpen(true);
  };
  
  const handleSortChange = (value: string) => {
    switch (value) {
      case "relevance":
        onSort({ field: "relevance", direction: "desc" });
        break;
      case "recent":
        onSort({ field: "created_at", direction: "desc" });
        break;
      case "salary":
        onSort({ field: "salary_max", direction: "desc" });
        break;
    }
  };

  const formatSalary = (job: Job) => {
    if (!job.salary_min && !job.salary_max) return "Salary not specified";
    
    const currency = job.salary_currency || "USD";
    const period = job.salary_period || "yearly";
    
    let formattedPeriod = "";
    switch (period) {
      case "hourly": formattedPeriod = "/hour"; break;
      case "daily": formattedPeriod = "/day"; break;
      case "weekly": formattedPeriod = "/week"; break;
      case "monthly": formattedPeriod = "/month"; break;
      case "yearly": formattedPeriod = "/year"; break;
      default: formattedPeriod = ""; // for flat rate
    }
    
    if (job.salary_min && job.salary_max) {
      return `${currency === "USD" ? "$" : ""}${job.salary_min.toLocaleString()} - ${currency === "USD" ? "$" : ""}${job.salary_max.toLocaleString()}${formattedPeriod}`;
    } else if (job.salary_min) {
      return `${currency === "USD" ? "$" : ""}${job.salary_min.toLocaleString()}${formattedPeriod}+`;
    } else if (job.salary_max) {
      return `Up to ${currency === "USD" ? "$" : ""}${job.salary_max.toLocaleString()}${formattedPeriod}`;
    }
    
    return "Salary not specified";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    
    const now = new Date();
    const date = new Date(dateString);
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
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold">{totalCount} Jobs Found</h2>
          <p className="text-sm text-foreground/60">Showing available opportunities</p>
        </div>
        
        <Tabs defaultValue="relevance" className="w-full sm:w-auto mt-4 sm:mt-0" onValueChange={handleSortChange}>
          <TabsList className="bg-cinematic-dark/50 border border-gold/10">
            <TabsTrigger value="relevance">Most Relevant</TabsTrigger>
            <TabsTrigger value="recent">Most Recent</TabsTrigger>
            <TabsTrigger value="salary">Highest Pay</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {jobs.length === 0 ? (
        <Card className="bg-card-gradient border-gold/10 p-8 text-center">
          <div className="space-y-3">
            <h3 className="text-xl font-medium">No jobs found</h3>
            <p className="text-foreground/70">Try adjusting your search filters to find more opportunities</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className={`bg-card-gradient overflow-hidden transition-all hover:border-gold/30 ${job.is_featured ? 'border-gold/20' : 'border-gold/10'}`}>
              {job.is_featured && (
                <div className="bg-gold/20 text-gold text-xs py-1 px-4 text-center">
                  Featured Opportunity
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          {job.is_verified && (
                            <Badge className="bg-blue-500/80 hover:bg-blue-500 text-white border-none">
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-foreground/70">{job.company}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-sm text-foreground/60">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                            <Badge variant="outline" className="ml-1 text-xs bg-cinematic-dark/30 border-gold/10">
                              {job.location_type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Posted {formatDate(job.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatSalary(job)}</span>
                          </div>
                        </div>
                        
                        <p className="mt-3 text-foreground/80">{job.description}</p>
                        
                        {job.requirements && job.requirements.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Requirements:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-foreground/70 text-sm">
                              {job.requirements.slice(0, 3).map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                              {job.requirements.length > 3 && (
                                <li>
                                  <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="h-auto p-0 text-gold"
                                    onClick={() => handleViewDetails(job)}
                                  >
                                    View {job.requirements.length - 3} more
                                  </Button>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                        
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-5">
                            {job.tags.map((tag) => (
                              <span 
                                key={tag} 
                                className="px-3 py-1 bg-cinematic-dark/70 text-foreground/80 text-xs rounded-full border border-gold/10"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`text-foreground/50 hover:text-gold ${savedJobs.includes(job.id) ? 'text-gold' : ''}`}
                        onClick={() => onSaveJob(job.id)}
                      >
                        <Bookmark className={`h-5 w-5 ${savedJobs.includes(job.id) ? 'fill-gold' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-between items-center mt-6 pt-4 border-t border-gold/10">
                  {job.application_deadline && (
                    <p className="text-sm text-foreground/60">
                      <Calendar className="h-4 w-4 inline-block mr-1" />
                      Deadline: <span className="font-medium text-foreground/80">
                        {new Date(job.application_deadline).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  
                  <div className="flex gap-3 mt-4 sm:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gold/30 hover:border-gold"
                      onClick={() => handleViewDetails(job)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-gold hover:bg-gold-dark text-cinematic"
                      onClick={() => handleApply(job)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetail
          job={selectedJob}
          isSaved={savedJobs.includes(selectedJob.id)}
          onToggleSave={onSaveJob}
          onApply={() => setIsApplicationOpen(true)}
          trigger={null}
        />
      )}
      
      {/* Job Application Form */}
      {selectedJob && (
        <JobApplicationForm
          job={selectedJob}
          isOpen={isApplicationOpen}
          onClose={() => setIsApplicationOpen(false)}
          onSubmit={(application) => onApplyJob(selectedJob.id, application)}
        />
      )}
    </div>
  );
};

export default JobResults;
