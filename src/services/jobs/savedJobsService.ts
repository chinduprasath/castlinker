
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

export const fetchSavedJobs = async (userId: string | undefined) => {
  if (!userId) {
    return [];
  }
  
  try {
    const savedJobsRef = collection(db, 'savedJobs');
    const q = query(savedJobsRef, where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const savedJobIds: string[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      savedJobIds.push(data.job_id);
    });

    return savedJobIds;
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
      const savedJobsRef = collection(db, 'savedJobs');
      const q = query(
        savedJobsRef,
        where('user_id', '==', userId),
        where('job_id', '==', jobId)
      );
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, 'savedJobs', document.id));
      });
      
      return {
        newSavedJobs: savedJobs.filter(id => id !== jobId),
        message: {
          title: 'Job removed',
          description: 'This job has been removed from your saved list'
        }
      };
    } else {
      // Add to saved jobs
      const savedJobsRef = collection(db, 'savedJobs');
      await addDoc(savedJobsRef, {
        user_id: userId,
        job_id: jobId,
        created_at: new Date()
      });
      
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
