
import { db } from '@/integrations/firebase/client';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  budget?: number;
  start_date?: string;
  end_date?: string;
  genre?: string;
  location?: string;
  director?: string;
  producer?: string;
  cast?: string[];
  crew?: string[];
  poster_url?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    // Mock data for testing
    return [
      {
        id: '1',
        title: 'Midnight Chronicles',
        description: 'A thriller about a detective investigating mysterious disappearances in a small town.',
        status: 'in-progress',
        budget: 50000,
        start_date: '2024-02-01',
        end_date: '2024-05-15',
        genre: 'Thriller',
        location: 'Vancouver, BC',
        director: 'James Miller',
        producer: 'Lisa Wong',
        cast: ['John Doe', 'Jane Smith'],
        crew: ['Mike Johnson (Cinematographer)', 'Sarah Lee (Sound Engineer)'],
        poster_url: '/placeholder.svg',
        created_at: new Date('2024-01-15').toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'user123'
      },
      {
        id: '2',
        title: 'Summer Dreams',
        description: 'A romantic comedy set during a music festival in California.',
        status: 'planning',
        budget: 75000,
        genre: 'Romance/Comedy',
        location: 'Los Angeles, CA',
        director: 'Emma Thompson',
        producer: 'David Kim',
        created_at: new Date('2024-01-20').toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'user123'
      },
      {
        id: '3',
        title: 'The Last Stand',
        description: 'An action drama about a group of soldiers on their final mission.',
        status: 'completed',
        budget: 120000,
        start_date: '2023-08-01',
        end_date: '2023-12-20',
        genre: 'Action/Drama',
        location: 'Atlanta, GA',
        director: 'Robert Chen',
        producer: 'Maria Rodriguez',
        poster_url: '/placeholder.svg',
        created_at: new Date('2023-07-15').toISOString(),
        updated_at: new Date('2023-12-20').toISOString(),
        user_id: 'user123'
      }
    ];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<string> => {
  try {
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, {
      ...projectData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      ...projectData,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
