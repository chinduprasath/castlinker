
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

export const fetchTeamMembers = async (projectId?: string) => {
  try {
    const membersRef = collection(db, 'team_members');
    let q;
    
    if (projectId) {
      q = query(membersRef, where('project_id', '==', projectId));
    } else {
      q = query(membersRef);
    }
    
    const querySnapshot = await getDocs(q);
    
    if (projectId) {
      const accepted: any[] = [];
      const pending: any[] = [];
      
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData && typeof docData === 'object') {
          const data = { id: doc.id, ...docData };
          if (docData.status === 'accepted') {
            accepted.push(data);
          } else if (docData.status === 'pending') {
            pending.push(data);
          }
        }
      });
      
      return { accepted, pending };
    } else {
      // For admin team management - return all members
      const members: any[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData && typeof docData === 'object') {
          const data = { id: doc.id, ...docData };
          members.push({
            id: data.id,
            name: data.name || 'Unknown',
            email: data.email || 'No email',
            role_name: data.role_name || 'Member',
            role: data.role,
            joined_date: data.created_at || new Date().toISOString(),
            avatar_url: data.avatar_url
          });
        }
      });
      return members;
    }
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

export const createTeamMember = async (memberData: any) => {
  try {
    const membersRef = collection(db, 'team_members');
    const docRef = await addDoc(membersRef, {
      ...memberData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating team member:', error);
    throw error;
  }
};

export const updateTeamMemberRole = async (memberId: string, roleId: string) => {
  try {
    await updateDoc(doc(db, 'team_members', memberId), {
      role_id: roleId,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating team member role:', error);
    throw error;
  }
};

export const deleteTeamMember = async (memberId: string) => {
  try {
    await deleteDoc(doc(db, 'team_members', memberId));
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

export const requestToJoinTeam = async (projectId: string, userId: string) => {
  try {
    const membersRef = collection(db, 'team_members');
    await addDoc(membersRef, {
      project_id: projectId,
      user_id: userId,
      status: 'pending',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error requesting to join team:', error);
    throw error;
  }
};

export const respondToTeamRequest = async (projectId: string, userId: string, action: 'accept' | 'reject') => {
  try {
    const membersRef = collection(db, 'team_members');
    const q = query(
      membersRef, 
      where('project_id', '==', projectId),
      where('user_id', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (docSnapshot) => {
      await updateDoc(doc(db, 'team_members', docSnapshot.id), {
        status: action === 'accept' ? 'accepted' : 'rejected',
        updated_at: serverTimestamp()
      });
    });
  } catch (error) {
    console.error('Error responding to team request:', error);
    throw error;
  }
};

export const removeTeamMember = async (projectId: string, userId: string) => {
  try {
    const membersRef = collection(db, 'team_members');
    const q = query(
      membersRef,
      where('project_id', '==', projectId),
      where('user_id', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, 'team_members', docSnapshot.id));
    });
  } catch (error) {
    console.error('Error removing team member:', error);
    throw error;
  }
};
