import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
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

const convertTimestamp = (timestamp: any): string => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return timestamp || new Date().toISOString();
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
    const jobsRef = collection(db, 'jobs');
    const q = query(
      jobsRef,
      where('status', '==', 'active'),
      firestoreLimit(PAGE_SIZE)
    );
    
    const querySnapshot = await getDocs(q);
    const allJobs: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      allJobs.push({
        id: doc.id,
        ...data,
        created_at: convertTimestamp(data.created_at)
      });
    });
    
    // Filter jobs that match the search term (client-side filtering for flexibility)
    const filteredJobs = allJobs.filter(job => 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('Search results:', filteredJobs.length, 'jobs found');
    return { data: filteredJobs, count: filteredJobs.length };
  } catch (error: any) {
    console.error('Error in searchJobs:', error);
    throw error;
  }
};

// Specialized function for filtering jobs
const filterJobs = async (filters: JobFilters, sort: { field: string; direction: string }): Promise<JobsQueryResult> => {
  try {
    const jobsRef = collection(db, 'jobs');
    let constraints: any[] = [where('status', '==', 'active')];

    // Apply job type filters
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      constraints.push(where('job_type', 'in', filters.jobTypes));
    }

    // Apply role category filters
    if (filters.roleCategories && filters.roleCategories.length > 0) {
      constraints.push(where('role_category', 'in', filters.roleCategories));
    }

    // Apply location type filters
    if (filters.locationTypes && filters.locationTypes.length > 0) {
      constraints.push(where('location_type', 'in', filters.locationTypes));
    }

    // Apply experience level filters
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      constraints.push(where('experience_level', 'in', filters.experienceLevels));
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
      
      constraints.push(where('created_at', '>=', Timestamp.fromDate(date)));
    }

    // Apply sorting
    if (sort.field === 'created_at') {
      constraints.push(orderBy('created_at', sort.direction === 'asc' ? 'asc' : 'desc'));
    } else if (sort.field === 'salary_max') {
      constraints.push(orderBy('salary_max', sort.direction === 'asc' ? 'asc' : 'desc'));
    } else {
      // Default sorting (relevance) - order by featured first, then created_at
      constraints.push(orderBy('is_featured', 'desc'));
      constraints.push(orderBy('created_at', 'desc'));
    }

    // Add limit
    constraints.push(firestoreLimit(PAGE_SIZE));

    const q = query(jobsRef, ...constraints);

    console.log('Executing query for jobs');
    
    const querySnapshot = await getDocs(q);
    const jobs: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      jobs.push({
        id: doc.id,
        ...data,
        created_at: convertTimestamp(data.created_at)
      });
    });

    // Apply additional client-side filters that can't be done in Firestore
    let filteredJobs = jobs;

    // Apply location filters
    if (filters.location && filters.location !== 'Remote') {
      filteredJobs = filteredJobs.filter(job => 
        job.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.location === 'Remote') {
      filteredJobs = filteredJobs.filter(job => job.location_type === 'Remote');
    }

    // Apply salary filters
    if (filters.salaryMin) {
      filteredJobs = filteredJobs.filter(job => 
        job.salary_min >= filters.salaryMin!
      );
    }

    if (filters.salaryMax) {
      filteredJobs = filteredJobs.filter(job => 
        job.salary_max <= filters.salaryMax!
      );
    }
    
    console.log('Query results:', filteredJobs.length, 'jobs found');
    return { data: filteredJobs, count: filteredJobs.length };
  } catch (error: any) {
    console.error('Error in filterJobs:', error);
    throw error;
  }
};
