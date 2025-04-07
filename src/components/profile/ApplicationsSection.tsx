
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ExternalLink, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Job } from "@/types/jobTypes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import JobDetail from "@/components/jobs/JobDetail";

interface ApplicationsSectionProps {
  jobs: Job[];
  isLoading: boolean;
  onRefresh: () => void;
}

interface Application {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  created_at: string;
  resume_url?: string;
  cover_letter?: string;
}

const ApplicationsSection = ({ jobs, isLoading, onRefresh }: ApplicationsSectionProps) => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [applications, setApplications] = useState<Record<string, Application>>({});
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user && jobs.length > 0) {
      fetchApplicationDetails();
    }
  }, [user, jobs]);

  const fetchApplicationDetails = async () => {
    if (!user) return;
    
    try {
      const jobIds = jobs.map(job => job.id);
      
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .in('job_id', jobIds);
        
      if (error) throw error;
      
      const applicationsMap: Record<string, Application> = {};
      if (data) {
        data.forEach(app => {
          applicationsMap[app.job_id] = app;
        });
      }
      
      setApplications(applicationsMap);
    } catch (error: any) {
      console.error("Error fetching application details:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-950/30 text-amber-400 border-amber-500/30">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-blue-950/30 text-blue-400 border-blue-500/30">Reviewed</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-500/30">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-950/30 text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="bg-card-gradient border-gold/10 p-8 text-center">
        <div className="space-y-3">
          <h3 className="text-xl font-medium">No applications</h3>
          <p className="text-foreground/70">You haven't applied to any jobs yet. Browse the jobs page to find opportunities that interest you.</p>
          <Button className="mt-4 bg-gold hover:bg-gold/90 text-black" asChild>
            <a href="/jobs">Browse Jobs</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Applications</h2>
        <Button variant="outline" onClick={onRefresh} size="sm">Refresh</Button>
      </div>
      
      <div className="space-y-4">
        {jobs.map(job => (
          <Card key={job.id} className="bg-card-gradient border-gold/10">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <p className="text-sm text-foreground/70">{job.company}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 text-sm text-foreground/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location} • {job.location_type}
                    </span>
                    
                    {applications[job.id]?.created_at && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Applied: {formatDate(applications[job.id]?.created_at)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-cinematic-dark/50">
                      {job.job_type}
                    </Badge>
                    <Badge variant="outline" className="bg-cinematic-dark/50">
                      {job.role_category}
                    </Badge>
                    {applications[job.id] && getStatusBadge(applications[job.id].status)}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsDetailOpen(true);
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Job Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetail
          job={selectedJob}
          isSaved={false}
          onToggleSave={() => {}}
          onApply={() => {}}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  );
};

export default ApplicationsSection;
