
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

const convertTimestamp = (timestamp: any): string => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return timestamp || new Date().toISOString();
};

export const fetchProjects = async (userId: string) => {
  try {
    const projectsRef = collection(db, 'projects');
    const q = query(
      projectsRef,
      where('team_head_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const projects: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        created_at: convertTimestamp(data.created_at),
        updated_at: convertTimestamp(data.updated_at)
      });
    });
    
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const createProject = async (projectData: any) => {
  try {
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, {
      ...projectData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const fetchProjectById = async (projectId: string) => {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId));
    
    if (projectDoc.exists()) {
      const data = projectDoc.data();
      return {
        id: projectDoc.id,
        ...data,
        created_at: convertTimestamp(data.created_at),
        updated_at: convertTimestamp(data.updated_at)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};
