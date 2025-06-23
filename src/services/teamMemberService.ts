
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
  orderBy 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from "@/integrations/firebase/client";
import { AdminTeamMember } from "@/types/rbacTypes";
import { TeamMember, AdminTeamRole } from "@/types/adminTypes";

const convertTimestamp = (timestamp: any): string => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return timestamp || new Date().toISOString();
};

export const fetchTeamMembers = async (): Promise<AdminTeamMember[]> => {
  try {
    const adminsRef = collection(db, 'admins');  
    const q = query(adminsRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const teamMembers: AdminTeamMember[] = [];
    
    for (const document of querySnapshot.docs) {
      const data = document.data();
      
      // Get role information if role_id exists
      let roleInfo = null;
      if (data.role_id) {
        try {
          const roleDoc = await getDoc(doc(db, 'adminRoles', data.role_id));
          if (roleDoc.exists()) {
            roleInfo = roleDoc.data();
          }
        } catch (err) {
          console.error('Error fetching role:', err);
        }
      }
      
      teamMembers.push({
        id: document.id,
        name: data.name,
        email: data.email,
        role: roleInfo || { name: data.role, description: '', is_system: false },
        role_name: roleInfo?.name || data.role,
        status: data.status,
        joined_date: convertTimestamp(data.joined_date),
        avatar_url: data.avatar_url
      });
    }
    
    return teamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

export const fetchAllTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const adminsRef = collection(db, 'admins');
    const q = query(adminsRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const teamMembers: TeamMember[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      teamMembers.push({
        id: doc.id,
        ...data,
        joined_date: convertTimestamp(data.joined_date)
      } as TeamMember);
    });
    
    return teamMembers;
  } catch (error) {
    console.error('Error fetching all team members:', error);
    throw error;
  }
};

export const updateTeamMemberRole = async (userId: string, roleId: string): Promise<void> => {
  try {
    const adminRef = doc(db, 'admins', userId);
    await updateDoc(adminRef, { 
      role_id: roleId,
      updated_at: new Date()
    });
  } catch (error) {
    console.error('Error updating team member role:', error);
    throw error;
  }
};

export const createTeamMember = async (member: {
  email: string;
  name: string;
  password?: string;
  roleId: string;
  avatar_url?: string;
}): Promise<void> => {
  try {
    // Generate a random password if not provided
    const password = member.password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + "!2";
    
    // First create the Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, member.email, password);
    const firebaseUser = userCredential.user;
    
    // Create entry in admins collection
    await addDoc(collection(db, 'admins'), {
      id: firebaseUser.uid,
      name: member.name,
      email: member.email.toLowerCase(),
      role: 'moderator' as AdminTeamRole,
      status: 'active',
      verified: true,
      avatar_url: member.avatar_url || '/images/avatar.png',
      role_id: member.roleId,
      joined_date: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });
    
    // Also create user profile
    await addDoc(collection(db, 'users'), {
      id: firebaseUser.uid,
      name: member.name,
      email: member.email,
      role: 'Admin',
      avatar: member.avatar_url || '/images/avatar.png',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    throw error;
  }
};

export const deleteTeamMember = async (userId: string): Promise<void> => {
  try {
    // Find the admin document by user ID
    const adminsRef = collection(db, 'admins');
    const q = query(adminsRef, where('id', '==', userId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'admins', document.id));
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};
