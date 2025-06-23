
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from "@/integrations/firebase/client";
import { AdminPermission, AdminRole, AdminRoleWithPermissions, AdminModule } from "@/types/rbacTypes";

const convertTimestamp = (timestamp: any): string => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toISOString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }
  return timestamp || new Date().toISOString();
};

export const fetchRoles = async (): Promise<AdminRole[]> => {
  try {
    const rolesRef = collection(db, 'adminRoles');
    const q = query(rolesRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    
    const roles: AdminRole[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      roles.push({
        id: doc.id,
        name: data.name,
        description: data.description,
        is_system: data.is_system,
        created_at: convertTimestamp(data.created_at),
        updated_at: convertTimestamp(data.updated_at)
      });
    });
    
    return roles;
  } catch (err) {
    console.error('Error in fetchRoles:', err);
    return [];
  }
};

export const createRole = async (role: {
  name: string;
  description?: string;
}): Promise<AdminRole> => {
  try {
    const rolesRef = collection(db, 'adminRoles');
    const docRef = await addDoc(rolesRef, {
      name: role.name,
      description: role.description || '',
      is_system: false,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newRole = await getDoc(docRef);
    const data = newRole.data()!;
    
    return {
      id: newRole.id,
      name: data.name,
      description: data.description,
      is_system: data.is_system,
      created_at: convertTimestamp(data.created_at),
      updated_at: convertTimestamp(data.updated_at)
    };
  } catch (err) {
    console.error('Error in createRole:', err);
    throw err;
  }
};

export const updateRolePermissions = async (
  roleId: string, 
  module: AdminModule, 
  permissions: {
    can_create?: boolean;
    can_edit?: boolean;
    can_delete?: boolean;
    can_view?: boolean;
  }
): Promise<AdminPermission> => {
  try {
    const permissionId = `${roleId}_${module}`;
    const permissionRef = doc(db, 'adminPermissions', permissionId);
    
    const permissionData = {
      role_id: roleId,
      module: module,
      can_create: permissions.can_create || false,
      can_edit: permissions.can_edit || false,
      can_delete: permissions.can_delete || false,
      can_view: permissions.can_view || false,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await setDoc(permissionRef, permissionData, { merge: true });
    
    const typedData: AdminPermission = {
      id: permissionId,
      role_id: roleId,
      module: module,
      can_create: permissionData.can_create,
      can_edit: permissionData.can_edit,
      can_delete: permissionData.can_delete,
      can_view: permissionData.can_view,
      created_at: convertTimestamp(permissionData.created_at),
      updated_at: convertTimestamp(permissionData.updated_at)
    };
    
    return typedData;
  } catch (err) {
    console.error('Error in updateRolePermissions:', err);
    throw err;
  }
};

export const fetchRoleWithPermissions = async (roleId: string): Promise<AdminRoleWithPermissions | null> => {
  try {
    // Get role data
    const roleDoc = await getDoc(doc(db, 'adminRoles', roleId));
    if (!roleDoc.exists()) {
      return null;
    }
    
    const roleData = roleDoc.data();
    
    // Get permissions for this role
    const permissionsRef = collection(db, 'adminPermissions');
    const q = query(permissionsRef, where('role_id', '==', roleId));
    const permissionsSnapshot = await getDocs(q);
    
    const permissions: AdminPermission[] = [];
    permissionsSnapshot.forEach((doc) => {
      const data = doc.data();
      permissions.push({
        id: doc.id,
        role_id: data.role_id,
        module: data.module as AdminModule,
        can_create: data.can_create,
        can_edit: data.can_edit,
        can_delete: data.can_delete,
        can_view: data.can_view,
        created_at: convertTimestamp(data.created_at),
        updated_at: convertTimestamp(data.updated_at)
      });
    });
    
    return {
      id: roleDoc.id,
      name: roleData.name,
      description: roleData.description,
      is_system: roleData.is_system,
      created_at: convertTimestamp(roleData.created_at),
      updated_at: convertTimestamp(roleData.updated_at),
      permissions
    };
  } catch (err) {
    console.error('Error in fetchRoleWithPermissions:', err);
    throw err;
  }
};
