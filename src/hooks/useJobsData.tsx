
import { useState, useEffect, useCallback } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [sort, setSort] = useState<JobSort>({ field: 'relevance', direction: 'desc' });
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch jobs based on filters and sorting
  const getJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, count, error } = await fetchJobs(filters, sort);
      
      if (error) {
        setError(error.message);
        console.error('Error fetching jobs:', error);
        toast({
          title: 'Error fetching jobs',
          description: error.message,
          variant: 'destructive',
        });
        // Still set empty array to prevent endless loading state
        setJobs([]);
        setTotalCount(0);
      } else {
        console.log('Job data fetched:', data.length, 'jobs');
        setJobs(data);
        setTotalCount(count);
      }
    } catch (error: any) {
      console.error('Error in getJobs:', error);
      setError(error.message || 'An unexpected error occurred');
      toast({
        title: 'Error fetching jobs',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      // Set empty array to prevent endless loading state
      setJobs([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, toast]);

  // Fetch user's saved jobs
  const getSavedJobs = useCallback(async () => {
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
  }, [user]);

  // Toggle saving a job
  const toggleSaveJob = useCallback(async (jobId: string) => {
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
  }, [savedJobs, user, toast]);

  // Apply for a job
  const applyForJob = useCallback(async (jobId: string, application: {
    resume_url?: string;
    cover_letter?: string;
    additional_files?: string[];
  }) => {
    const result = await applyForJobService(jobId, user?.id, application);
    toast(result.message);
    return result.success;
  }, [user, toast]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Update sort
  const updateSort = useCallback((newSort: JobSort) => {
    setSort(newSort);
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Effect to fetch jobs when filters or sort changes
  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        await getJobs();
      } catch (err) {
        console.error('Error in fetchJobsData effect:', err);
      }
    };
    
    fetchJobsData();
  }, [getJobs]);

  // Effect to fetch saved jobs on mount and when user changes
  useEffect(() => {
    const fetchSavedJobsData = async () => {
      try {
        await getSavedJobs();
      } catch (err) {
        console.error('Error in fetchSavedJobsData effect:', err);
      }
    };
    
    fetchSavedJobsData();
  }, [getSavedJobs]);

  return {
    jobs,
    isLoading,
    error,
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
