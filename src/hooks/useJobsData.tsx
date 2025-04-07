
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchJobs, 
  fetchSavedJobs,
  toggleSaveJob as toggleSaveJobService,
  applyForJob as applyForJobService
} from '@/services/jobsService';
import { Job, JobFilters, JobSort } from '@/types/jobTypes';

export type { Job, JobFilters, JobSort, JobType, LocationType, RoleCategory, ExperienceLevel, PostedWithin } from '@/types/jobTypes';

export const useJobsData = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilters>({});
  const [sort, setSort] = useState<JobSort>({ field: 'relevance', direction: 'desc' });
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch jobs based on filters and sorting
  const getJobs = async () => {
    setIsLoading(true);
    try {
      const { data, count } = await fetchJobs(filters, sort);
      setJobs(data);
      setTotalCount(count);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error fetching jobs',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's saved jobs
  const getSavedJobs = async () => {
    if (!user) {
      // If not logged in, try to get from localStorage
      const storedSavedJobs = localStorage.getItem('savedJobs');
      if (storedSavedJobs) {
        setSavedJobs(JSON.parse(storedSavedJobs));
      }
      return;
    }

    try {
      const savedJobIds = await fetchSavedJobs(user.id);
      setSavedJobs(savedJobIds);
    } catch (error: any) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  // Toggle saving a job
  const toggleSaveJob = async (jobId: string) => {
    try {
      // If not logged in, save to localStorage
      if (!user) {
        const updatedSavedJobs = savedJobs.includes(jobId)
          ? savedJobs.filter(id => id !== jobId)
          : [...savedJobs, jobId];
        
        setSavedJobs(updatedSavedJobs);
        localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
        
        toast({
          title: savedJobs.includes(jobId) ? 'Job removed' : 'Job saved',
          description: savedJobs.includes(jobId) 
            ? 'This job has been removed from your saved list' 
            : 'This job has been saved for later',
        });
        
        return;
      }

      const { newSavedJobs, message } = await toggleSaveJobService(jobId, user.id, savedJobs);
      setSavedJobs(newSavedJobs);
      toast(message);
    } catch (error: any) {
      console.error('Error toggling saved job:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save/unsave job',
        variant: 'destructive',
      });
    }
  };

  // Apply for a job
  const applyForJob = async (jobId: string, application: {
    resume_url?: string;
    cover_letter?: string;
    additional_files?: string[];
  }) => {
    const result = await applyForJobService(jobId, user?.id, application);
    toast(result.message);
    return result.success;
  };

  // Update filters
  const updateFilters = (newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Update sort
  const updateSort = (newSort: JobSort) => {
    setSort(newSort);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
  };

  // Effect to fetch jobs when filters or sort changes
  useEffect(() => {
    getJobs();
  }, [filters, sort]);

  // Effect to fetch saved jobs on mount and when user changes
  useEffect(() => {
    getSavedJobs();
  }, [user]);

  return {
    jobs,
    isLoading,
    totalCount,
    filters,
    sort,
    savedJobs,
    updateFilters,
    updateSort,
    resetFilters,
    toggleSaveJob,
    applyForJob,
    refetchJobs: getJobs,
  };
};
