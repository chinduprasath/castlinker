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

export const fetchTeamMembers = async (projectId: string) => {
  try {
    const membersRef = collection(db, 'projects', projectId, 'team_members');
    const querySnapshot = await getDocs(membersRef);
    const members: any[] = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      if (docData && typeof docData === 'object') {
        members.push({ id: doc.id, ...docData });
      }
    });
    return members;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

export const sendTeamInviteNotification = async (userId, projectId, projectName, inviterId, inviterName) => {
  await addDoc(collection(db, 'notifications'), {
    userId,
    type: 'team_invite',
    projectId,
    projectName,
    inviterId,
    inviterName,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
};

export const createTeamMember = async (projectId: string, memberData: any, projectName?: string, inviterId?: string, inviterName?: string) => {
  try {
    const membersRef = collection(db, 'projects', projectId, 'team_members');
    // Prevent duplicate by email
    const q = query(membersRef, where('email', '==', memberData.email));
    const existing = await getDocs(q);
    if (!existing.empty) {
      throw new Error('Member with this email already exists.');
    }
    const docRef = await addDoc(membersRef, {
      ...memberData,
      status: 'pending',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    // Send notification if userId is provided
    if (memberData.userId && projectName && inviterId && inviterName) {
      await sendTeamInviteNotification(memberData.userId, projectId, projectName, inviterId, inviterName);
    }
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating team member:', error);
    throw error;
  }
};

export const updateTeamMemberRole = async (projectId: string, memberId: string, roleId: string) => {
  try {
    await updateDoc(doc(db, 'projects', projectId, 'team_members', memberId), {
      role_id: roleId,
      updated_at: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating team member role:', error);
    throw error;
  }
};

export const deleteTeamMember = async (projectId: string, memberId: string) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId, 'team_members', memberId));
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

export const requestToJoinTeam = async (projectId: string, userId: string) => {
  try {
    const membersRef = collection(db, 'projects', projectId, 'team_members');
    await addDoc(membersRef, {
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

export const respondToTeamRequest = async (projectId: string, memberId: string, action: 'accept' | 'reject') => {
  try {
    await updateDoc(doc(db, 'projects', projectId, 'team_members', memberId), {
      status: action === 'accept' ? 'accepted' : 'rejected',
      updated_at: serverTimestamp()
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
