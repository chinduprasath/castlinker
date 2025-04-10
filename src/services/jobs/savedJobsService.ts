
import { supabase } from '@/integrations/supabase/client';

export const fetchSavedJobs = async (userId: string | undefined) => {
  if (!userId) {
    return [];
  }
  
  try {
    const { data, error } = await (supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', userId) as any);

    if (error) throw error;
    
    return data?.map((record: any) => record.job_id) || [];
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    throw error;
  }
};

export const toggleSaveJob = async (jobId: string, userId: string | undefined, savedJobs: string[]) => {
  if (!userId) {
    return { 
      newSavedJobs: savedJobs.includes(jobId)
        ? savedJobs.filter(id => id !== jobId)
        : [...savedJobs, jobId],
      message: {
        title: savedJobs.includes(jobId) ? 'Job removed' : 'Job saved',
        description: savedJobs.includes(jobId) 
          ? 'This job has been removed from your saved list' 
          : 'This job has been saved for later'
      }
    };
  }

  try {
    if (savedJobs.includes(jobId)) {
      // Delete from saved jobs
      const { error } = await (supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', userId)
        .eq('job_id', jobId) as any);

      if (error) throw error;
      
      return {
        newSavedJobs: savedJobs.filter(id => id !== jobId),
        message: {
          title: 'Job removed',
          description: 'This job has been removed from your saved list'
        }
      };
    } else {
      // Add to saved jobs
      const { error } = await (supabase
        .from('saved_jobs')
        .insert({
          user_id: userId,
          job_id: jobId
        }) as any);

      if (error) throw error;
      
      return {
        newSavedJobs: [...savedJobs, jobId],
        message: {
          title: 'Job saved',
          description: 'This job has been saved to your profile'
        }
      };
    }
  } catch (error) {
    console.error('Error toggling saved job:', error);
    throw error;
  }
};
