
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Temporary';
export type LocationType = 'On-site' | 'Remote' | 'Hybrid';
export type RoleCategory = 'Acting' | 'Directing' | 'Production' | 'Cinematography' | 'Writing' | 'Editing' | 'Sound' | 'VFX' | 'Costume' | 'Makeup' | 'Other';
export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';
export type PostedWithin = '24h' | '3d' | '7d' | '14d' | '30d' | 'any';

export interface Job {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  job_type: JobType;
  role_category: RoleCategory;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_period?: string;
  location: string;
  location_type: LocationType;
  tags?: string[];
  application_deadline?: string;
  application_url?: string;
  application_email?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  created_at?: string;
  status?: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  jobTypes?: JobType[];
  roleCategories?: RoleCategory[];
  experienceLevels?: ExperienceLevel[];
  postedWithin?: PostedWithin;
  locationTypes?: LocationType[];
  salaryMin?: number;
  salaryMax?: number;
}

export interface JobSort {
  field: 'relevance' | 'created_at' | 'salary_max';
  direction: 'asc' | 'desc';
}

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
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('film_jobs').select('*', { count: 'exact' });

      // Apply filters
      if (filters.search && filters.search.trim() !== '') {
        // Use the search_film_jobs function for text search
        const { data, error, count } = await supabase.rpc('search_film_jobs', {
          search_term: filters.search
        });
        
        if (error) throw error;
        setJobs(data || []);
        setTotalCount(count || 0);
        setIsLoading(false);
        return;
      }

      if (filters.location && filters.location !== 'Remote') {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.location === 'Remote') {
        query = query.eq('location_type', 'Remote');
      }

      if (filters.jobTypes && filters.jobTypes.length > 0) {
        query = query.in('job_type', filters.jobTypes);
      }

      if (filters.roleCategories && filters.roleCategories.length > 0) {
        query = query.in('role_category', filters.roleCategories);
      }

      if (filters.locationTypes && filters.locationTypes.length > 0) {
        query = query.in('location_type', filters.locationTypes);
      }

      if (filters.experienceLevels && filters.experienceLevels.length > 0) {
        query = query.in('experience_level', filters.experienceLevels);
      }

      if (filters.salaryMin) {
        query = query.gte('salary_min', filters.salaryMin);
      }

      if (filters.salaryMax) {
        query = query.lte('salary_max', filters.salaryMax);
      }

      if (filters.postedWithin && filters.postedWithin !== 'any') {
        const now = new Date();
        let date = new Date();
        
        switch (filters.postedWithin) {
          case '24h':
            date.setDate(now.getDate() - 1);
            break;
          case '3d':
            date.setDate(now.getDate() - 3);
            break;
          case '7d':
            date.setDate(now.getDate() - 7);
            break;
          case '14d':
            date.setDate(now.getDate() - 14);
            break;
          case '30d':
            date.setDate(now.getDate() - 30);
            break;
        }
        
        query = query.gte('created_at', date.toISOString());
      }

      // Apply sorting
      if (sort.field === 'created_at') {
        query = query.order('created_at', { ascending: sort.direction === 'asc' });
      } else if (sort.field === 'salary_max') {
        query = query.order('salary_max', { ascending: sort.direction === 'asc', nullsFirst: false });
      } else {
        // Default sorting (relevance) - order by featured first, then created_at
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      }

      // Only active jobs
      query = query.eq('status', 'active');

      const { data, error, count } = await query;

      if (error) throw error;
      
      setJobs(data || []);
      setTotalCount(count || 0);
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
  const fetchSavedJobs = async () => {
    if (!user) {
      // If not logged in, try to get from localStorage
      const storedSavedJobs = localStorage.getItem('savedJobs');
      if (storedSavedJobs) {
        setSavedJobs(JSON.parse(storedSavedJobs));
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const savedJobIds = data.map(record => record.job_id);
      setSavedJobs(savedJobIds);
    } catch (error: any) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  // Toggle saving a job
  const toggleSaveJob = async (jobId: string) => {
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

    try {
      if (savedJobs.includes(jobId)) {
        // Delete from saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);

        if (error) throw error;
        
        setSavedJobs(savedJobs.filter(id => id !== jobId));
        toast({
          title: 'Job removed',
          description: 'This job has been removed from your saved list',
        });
      } else {
        // Add to saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: jobId
          });

        if (error) throw error;
        
        setSavedJobs([...savedJobs, jobId]);
        toast({
          title: 'Job saved',
          description: 'This job has been saved to your profile',
        });
      }
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
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to apply for jobs',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_id: jobId,
          ...application
        });

      if (error) throw error;
      
      toast({
        title: 'Application submitted',
        description: 'Your application has been submitted successfully',
      });
      return true;
    } catch (error: any) {
      console.error('Error applying for job:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application',
        variant: 'destructive',
      });
      return false;
    }
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
    fetchJobs();
  }, [filters, sort]);

  // Effect to fetch saved jobs on mount and when user changes
  useEffect(() => {
    fetchSavedJobs();
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
    refetchJobs: fetchJobs,
  };
};
