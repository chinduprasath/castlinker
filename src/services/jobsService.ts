import { db } from '@/integrations/firebase/client';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';

// Example service functions for jobs using Firebase Firestore

export const fetchJobs = async () => {
  try {
    const jobsRef = collection(db, 'film_jobs');
    const q = query(jobsRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    const jobs: any[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      jobs.push({
        id: docSnap.id,
        ...data
      });
    });
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const createJob = async (jobData: any) => {
  try {
    const jobsRef = collection(db, 'film_jobs');
    const docRef = await addDoc(jobsRef, {
      ...jobData,
      created_at: new Date(),
      updated_at: new Date()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const updateJob = async (jobId: string, jobData: any) => {
  try {
    const jobRef = doc(db, 'film_jobs', jobId);
    await updateDoc(jobRef, {
      ...jobData,
      updated_at: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

export const deleteJob = async (jobId: string) => {
  try {
    const jobRef = doc(db, 'film_jobs', jobId);
    await deleteDoc(jobRef);
    return true;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

export const fetchJobsByUser = async (userId: string) => {
  try {
    const jobsRef = collection(db, 'film_jobs');
    const q = query(jobsRef, where('created_by', '==', userId), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    const jobs: any[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      jobs.push({
        id: docSnap.id,
        ...data
      });
    });
    return jobs;
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    throw error;
  }
};
