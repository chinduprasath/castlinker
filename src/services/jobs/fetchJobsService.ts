
import { supabase } from '@/integrations/supabase/client';
import { JobFilters } from '@/types/jobTypes';

// Set a reasonable limit to prevent timeout issues
const PAGE_SIZE = 20;

// Define a consistent return type for all our functions
type JobsQueryResult = {
  data: any[];
  count: number;
  error?: {
    message: string;
    originalError?: any;
  };
};

export const fetchJobs = async (filters: JobFilters, sort: { field: string; direction: string }): Promise<JobsQueryResult> => {
  try {
    console.log('Fetching jobs with filters:', filters, 'and sort:', sort);
    
    // If there's a search term, use the search function
    if (filters.search && filters.search.trim() !== '') {
      return await searchJobs(filters.search);
    }
    
    // Otherwise use the regular filtering approach
    return await filterJobs(filters, sort);
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    // Return empty data but with error property to handle in the UI
    return { 
      data: [], 
      count: 0, 
      error: {
        message: error.message || 'Failed to fetch jobs. Please check your connection and try again.',
        originalError: error
      }
    };
  }
};

// Specialized function for text search
const searchJobs = async (searchTerm: string): Promise<JobsQueryResult> => {
  console.log('Using search term:', searchTerm);
  
  try {
    const { data, error, count } = await supabase.rpc('search_film_jobs', {
      search_term: searchTerm
    }).limit(PAGE_SIZE) as any;
    
    if (error) {
      console.error('Search error:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
    
    console.log('Search results:', data?.length || 0, 'jobs found');
    return { data: data || [], count: count || 0 };
  } catch (error: any) {
    console.error('Error in searchJobs:', error);
    throw error;
  }
};

// Specialized function for filtering jobs
const filterJobs = async (filters: JobFilters, sort: { field: string; direction: string }): Promise<JobsQueryResult> => {
  try {
    let query = supabase.from('film_jobs').select('*', { count: 'exact' }).limit(PAGE_SIZE) as any;

    // Apply location filters
    if (filters.location && filters.location !== 'Remote') {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.location === 'Remote') {
      query = query.eq('location_type', 'Remote');
    }

    // Apply job type filters
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      query = query.in('job_type', filters.jobTypes);
    }

    // Apply role category filters
    if (filters.roleCategories && filters.roleCategories.length > 0) {
      query = query.in('role_category', filters.roleCategories);
    }

    // Apply location type filters
    if (filters.locationTypes && filters.locationTypes.length > 0) {
      query = query.in('location_type', filters.locationTypes);
    }

    // Apply experience level filters
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      query = query.in('experience_level', filters.experienceLevels);
    }

    // Apply salary filters
    if (filters.salaryMin) {
      query = query.gte('salary_min', filters.salaryMin);
    }

    if (filters.salaryMax) {
      query = query.lte('salary_max', filters.salaryMax);
    }

    // Apply date filters
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

    console.log('Executing query for jobs');
    
    // Using an AbortController with a timeout for the query
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 8000); // 8 second timeout
    
    const { data, error, count } = await query as any;
    
    // Clear the timeout since the query completed
    clearTimeout(timeoutId);

    if (error) {
      console.error('Query error:', error);
      return { 
        data: [], 
        count: 0, 
        error: {
          message: `Query failed: ${error.message}`,
          originalError: error
        }
      };
    }
    
    console.log('Query results:', data?.length || 0, 'jobs found');
    return { data: data || [], count: count || 0 };
  } catch (error: any) {
    console.error('Error in filterJobs:', error);
    throw error;
  }
};
