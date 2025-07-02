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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

export type { Job, JobFilters, JobSort, JobType, LocationType, RoleCategory, ExperienceLevel, PostedWithin } from '@/types/jobTypes';

export const useJobsData = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [sort, setSort] = useState<JobSort>({ field: 'created_at', direction: 'desc' });
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Add a ref to track if this is the initial render
  const initialRenderCompleted = useRef(false);
  // Add a ref for ongoing fetch operations
  const fetchInProgress = useRef(false);

  // Fetch all jobs on mount
  useEffect(() => {
    const fetchAllJobs = async () => {
      setIsLoading(true);
      try {
        const jobsRef = collection(db, 'film_jobs');
        const querySnapshot = await getDocs(jobsRef);
        const all = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            company: data.company || '',
            description: data.description || '',
            job_type: data.job_type || '',
            role_category: data.role_category || '',
            location: data.location || '',
            location_type: data.location_type || '',
            requirements: data.requirements || [],
            responsibilities: data.responsibilities || [],
            experience_level: data.experience_level || '',
            salary_min: data.salary_min,
            salary_max: data.salary_max,
            salary_currency: data.salary_currency,
            salary_period: data.salary_period,
            tags: data.tags || [],
            application_deadline: data.application_deadline,
            application_url: data.application_url,
            application_email: data.application_email,
            is_featured: data.is_featured,
            is_verified: data.is_verified,
            created_at: data.created_at,
            status: data.status,
          };
        });
        setAllJobs(all);
        setJobs(all);
        setTotalCount(all.length);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch jobs.');
        setJobs([]);
        setAllJobs([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllJobs();
  }, []);

  // Instant search/filtering on the frontend
  useEffect(() => {
    let filtered = allJobs;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchLower) ||
        job.role_category?.toLowerCase().includes(searchLower)
      );
    }
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      filtered = filtered.filter(job =>
        filters.jobTypes.includes(job.job_type as import('@/types/jobTypes').JobType)
      );
    }
    if (filters.roleCategories && filters.roleCategories.length > 0) {
      filtered = filtered.filter(job =>
        filters.roleCategories.includes(job.role_category)
      );
    }
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      filtered = filtered.filter(job =>
        filters.experienceLevels.includes(job.experience_level as import('@/types/jobTypes').ExperienceLevel)
      );
    }
    if (filters.salaryMin !== undefined) {
      filtered = filtered.filter(job =>
        typeof job.salary_min === 'number' && job.salary_min >= filters.salaryMin
      );
    }
    if (filters.salaryMax !== undefined) {
      filtered = filtered.filter(job =>
        typeof job.salary_max === 'number' && job.salary_max <= filters.salaryMax
      );
    }
    setJobs(filtered);
    setTotalCount(filtered.length);
  }, [filters, allJobs]);

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
