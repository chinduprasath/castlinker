import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  Timestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from "@/integrations/firebase/client";

export type Post = {
  id: string;
  title: string;
  description: string;
  created_by: string;
  creator_name: string | null;
  creator_profession: string | null;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  like_count: number;
  media_url?: string | null;
  media_type?: string | null;
  event_date?: string | null;
  external_url?: string | null;
  place?: string | null;
  location?: string | null;
  pincode?: string | null;
  landmark?: string | null;
};

export type PostApplication = {
  id: string;
  post_id: string;
  user_id: string;
  applied_at: string;
  profile?: {
    id?: string;
    full_name?: string;
    avatar_url?: string;
    profession_type?: string;
    location?: string;
    email?: string;
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

export const fetchPosts = async () => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        created_at: convertTimestamp(data.created_at),
        updated_at: convertTimestamp(data.updated_at)
      } as Post);
    });
    
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const fetchPostById = async (id: string) => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', id));
    
    if (postDoc.exists()) {
      const data = postDoc.data();
      return {
        id: postDoc.id,
        ...data,
        created_at: convertTimestamp(data.created_at),
        updated_at: convertTimestamp(data.updated_at)
      } as Post;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

export const createPost = async (post: Omit<Post, "id" | "created_at" | "updated_at" | "like_count">) => {
  try {
    const postsRef = collection(db, 'posts');
    const docRef = await addDoc(postsRef, {
      ...post,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      like_count: 0
    });

    const newPost = await getDoc(docRef);
    if (newPost.exists()) {
      const data = newPost.data();
      return {
        id: newPost.id,
        ...data,
        created_at: convertTimestamp(data.created_at),
        updated_at: convertTimestamp(data.updated_at)
      } as Post;
    }
    
    return null;
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
};

export const updatePost = async (id: string, post: Partial<Post>) => {
  try {
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, {
      ...post,
      updated_at: serverTimestamp()
    });

    const updatedPost = await getDoc(postRef);
    if (updatedPost.exists()) {
      const data = updatedPost.data();
      return {
        id: updatedPost.id,
        ...data,
        created_at: convertTimestamp(data.created_at),
        updated_at: convertTimestamp(data.updated_at)
      } as Post;
    }
    
    return null;
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
};

export const deletePost = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'posts', id));
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};

export const applyToPost = async (post_id: string, user_id: string) => {
  try {
    const applicationsRef = collection(db, 'postApplications');
    const docRef = await addDoc(applicationsRef, {
      post_id,
      user_id,
      applied_at: serverTimestamp()
    });

    const newApplication = await getDoc(docRef);
    if (newApplication.exists()) {
      const data = newApplication.data();
      return {
        id: newApplication.id,
        ...data,
        applied_at: convertTimestamp(data.applied_at)
      } as PostApplication;
    }
    
    return null;
  } catch (error) {
    console.error("Error applying to post:", error);
    return null;
  }
};

export const checkIfApplied = async (post_id: string, user_id: string) => {
  try {
    const applicationsRef = collection(db, 'postApplications');
    const q = query(
      applicationsRef, 
      where('post_id', '==', post_id),
      where('user_id', '==', user_id)
    );
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking application:", error);
    return false;
  }
};

export const getApplicationsForPost = async (post_id: string) => {
  try {
    const applicationsRef = collection(db, 'postApplications');
    const q = query(applicationsRef, where('post_id', '==', post_id));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return [];
    }
    
    const applications: PostApplication[] = [];
    const userIds: string[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      applications.push({
        id: doc.id,
        ...data,
        applied_at: convertTimestamp(data.applied_at)
      } as PostApplication);
      userIds.push(data.user_id);
    });
    
    // Fetch user profiles
    const profiles: any[] = [];
    for (const userId of userIds) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          profiles.push({
            id: userDoc.id,
            ...userDoc.data()
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
    
    const applicationsWithProfiles = applications.map(app => {
      const profile = profiles.find(p => p.id === app.user_id) || null;
      return {
        ...app,
        profile: profile ? {
          id: profile.id,
          full_name: profile.name,
          avatar_url: profile.avatar,
          profession_type: profile.role,
          location: profile.location,
          email: profile.email
        } : null
      };
    });
    
    return applicationsWithProfiles;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

export const togglePostLike = async (post_id: string, user_id: string) => {
  try {
    const likesRef = collection(db, 'postLikes');
    const postRef = doc(db, 'posts', post_id);
    const q = query(
      likesRef,
      where('post_id', '==', post_id),
      where('user_id', '==', user_id)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Remove like
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, 'postLikes', document.id));
      });
      // Decrement like_count
      await updateDoc(postRef, { like_count: increment(-1) });
      return false;
    } else {
      // Add like
      await addDoc(likesRef, {
        post_id,
        user_id,
        created_at: serverTimestamp()
      });
      // Increment like_count
      await updateDoc(postRef, { like_count: increment(1) });
      return true;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return null;
  }
};

export const checkIfLiked = async (post_id: string, user_id: string) => {
  try {
    const likesRef = collection(db, 'postLikes');
    const q = query(
      likesRef,
      where('post_id', '==', post_id),
      where('user_id', '==', user_id)
    );
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking like:", error);
    return false;
  }
};

export const uploadPostMedia = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const storageRef = ref(storage, `post_media/${userId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export const getApplicantsByPostId = async (postId: string) => {
  return await getApplicationsForPost(postId);
};

export const getUserProfileById = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const fetchPostsByUser = async (userId: string) => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('created_by', '==', userId), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        ...data,
        created_at: convertTimestamp(data.created_at),
        updated_at: convertTimestamp(data.updated_at)
      } as Post);
    });
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};

export const getLikeCountForPost = async (postId: string) => {
  try {
    const likesRef = collection(db, 'postLikes');
    const q = query(likesRef, where('post_id', '==', postId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
};

export const fetchLikedPostsByUser = async (userId: string) => {
  try {
    // First, get all post IDs that the user has liked
    const likesRef = collection(db, 'postLikes');
    const likesQuery = query(likesRef, where('user_id', '==', userId));
    const likesSnapshot = await getDocs(likesQuery);
    
    if (likesSnapshot.empty) {
      return [];
    }
    
    const likedPostIds = likesSnapshot.docs.map(doc => doc.data().post_id);
    
    // Then fetch the actual posts
    const posts: Post[] = [];
    for (const postId of likedPostIds) {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          const data = postDoc.data();
          posts.push({
            id: postDoc.id,
            ...data,
            created_at: convertTimestamp(data.created_at),
            updated_at: convertTimestamp(data.updated_at)
          } as Post);
        }
      } catch (error) {
        console.error(`Error fetching liked post ${postId}:`, error);
      }
    }
    
    // Sort by like date (most recent first)
    return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return [];
  }
};
