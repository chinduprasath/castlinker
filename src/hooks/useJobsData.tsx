
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  fetchJobs, 
  fetchSavedJobs,
  toggleSaveJob as toggleSaveJobService,
  applyForJob as applyForJobService
} from '@/services/jobs';
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
  
  // Add a ref to track if this is the initial render
  const initialRenderCompleted = useRef(false);
  // Add a ref for ongoing fetch operations
  const fetchInProgress = useRef(false);

  // Fetch jobs based on filters and sorting
  const getJobs = useCallback(async () => {
    // If a fetch is already in progress, don't start another one
    if (fetchInProgress.current) return;
    
    fetchInProgress.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchJobs(filters, sort);
      
      if (result.error) {
        setError(result.error.message);
        console.error('Error fetching jobs:', result.error);
        toast({
          title: 'Error fetching jobs',
          description: result.error.message,
          variant: 'destructive',
        });
        // Still set empty array to prevent endless loading state
        setJobs([]);
        setTotalCount(0);
      } else {
        console.log('Job data fetched:', result.data.length, 'jobs');
        setJobs(result.data);
        setTotalCount(result.count);
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
      fetchInProgress.current = false;
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

  // Effect to fetch jobs when filters or sort changes, but not on initial render
  useEffect(() => {
    // If this is the first render, mark it as completed and fetch jobs
    if (!initialRenderCompleted.current) {
      initialRenderCompleted.current = true;
      getJobs();
      return;
    }
    
    // For subsequent filter/sort changes, fetch jobs after a small delay
    const timer = setTimeout(() => {
      getJobs();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [getJobs, filters, sort]);

  // Effect to fetch saved jobs on mount and when user changes
  useEffect(() => {
    getSavedJobs();
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
