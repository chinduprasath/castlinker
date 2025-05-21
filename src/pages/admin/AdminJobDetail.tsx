
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Job, RoleCategory, LocationType } from '@/types/jobTypes';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

const AdminJobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('film_jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (error) throw error;
        
        // Cast both role_category and location_type to ensure they match the required types
        const formattedJob: Job = {
          ...data,
          role_category: data.role_category as RoleCategory,
          location_type: data.location_type as LocationType
        };

        setJob(formattedJob);
      } catch (error: any) {
        console.error("Error fetching job details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load job details"
        });
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 text-center">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto py-6 text-center text-destructive">
        Job not found.
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  // Helper function to format salary range
  const formatSalary = (min?: number, max?: number, currency?: string, period?: string) => {
    if (min === undefined && max === undefined) return 'N/A';
    const currencySymbol = currency || '';
    const periodText = period ? ` / ${period}` : '';
    if (min !== undefined && max !== undefined) return `${currencySymbol}${min} - ${currencySymbol}${max}${periodText}`;
    if (min !== undefined) return `From ${currencySymbol}${min}${periodText}`;
    if (max !== undefined) return `Up to ${currencySymbol}${max}${periodText}`;
    return 'N/A';
  };

  return (
    <div className="space-y-6 container mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gold-gradient-text">Job Details</h1>
          <p className="text-muted-foreground">Comprehensive view of Job ID: {job.id}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log('Edit job:', job.id)} className="cursor-pointer">Edit Job</DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Delete job:', job.id)} className="text-destructive focus:text-destructive cursor-pointer">Delete Job</DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Block job:', job.id)} className="cursor-pointer">Block Job Post</DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Toggle Verified Status for job:', job.id)} className="cursor-pointer">Toggle Verified Tag ({job.is_verified ? 'On' : 'Off'})</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Job Title</p>
            <p className="text-lg">{job.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Company Name</p>
            <p className="text-lg">{job.company}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Category</p>
            <p className="text-lg"><Badge variant="outline">{job.role_category}</Badge></p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Job Type</p>
            <p className="text-lg">{job.job_type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p className="text-lg">{job.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Salary Range</p>
            <p className="text-lg">{formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Experience Level</p>
            <p className="text-lg">{job.experience_level || 'N/A'}</p>
          </div>
          {/* Placeholders for data not in Job interface */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Language Requirements</p>
            <p className="text-lg">N/A (Placeholder)</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Number of Openings</p>
            <p className="text-lg">N/A (Placeholder)</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Gender Preference</p>
            <p className="text-lg">N/A (Placeholder)</p>
          </div>
          {/* End Placeholders */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dates and Status</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <p className="text-sm font-medium text-muted-foreground">Posted Date</p>
            <p className="text-lg">{formatDate(job.created_at)}</p>
          </div>
           <div>
            <p className="text-sm font-medium text-muted-foreground">Application Deadline</p>
            <p className="text-lg">{formatDate(job.application_deadline)}</p>
          </div>
           {/* Placeholder for Expiry Date (assuming different from deadline)*/}
           <div>
            <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
            <p className="text-lg">N/A (Placeholder)</p>
          </div>
           <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-lg"><Badge>{job.status}</Badge></p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Verification Status</p>
            <p className="text-lg"><Badge variant={job.is_verified ? "default" : "secondary"}>{job.is_verified ? "Verified Job" : "Not Verified"}</Badge></p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base">{job.description}</p>
        </CardContent>
      </Card>

       {job.requirements && job.requirements.length > 0 && (
         <Card>
           <CardHeader>
             <CardTitle>Requirements</CardTitle>
           </CardHeader>
           <CardContent>
             <ul className="list-disc pl-5">
               {job.requirements.map((req, index) => (
                 <li key={index}>{req}</li>
               ))}
             </ul>
           </CardContent>
         </Card>
       )}

        {job.responsibilities && job.responsibilities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {job.responsibilities.map((res, index) => (
                  <li key={index}>{res}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Placeholder for Who Posted (User Profile Link) */}
         <Card>
           <CardHeader>
             <CardTitle>Posted By</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-base text-muted-foreground">User profile link goes here (Placeholder)</p>
           </CardContent>
         </Card>

        {/* Placeholder for Applications */}
         <Card>
           <CardHeader>
             <CardTitle>Applications</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-base text-muted-foreground">Application list or summary here (Placeholder)</p>
           </CardContent>
         </Card>

    </div>
  );
};

export default AdminJobDetail;
