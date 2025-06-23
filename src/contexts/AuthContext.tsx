
import { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/integrations/firebase/client';
import { useToast } from '@/hooks/use-toast';

// Define User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isLoggedIn: boolean;
}

// Define AuthContext interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Hardcoded credentials
const HARDCODED_CREDENTIALS = {
  user: {
    email: 'user@gmail.com',
    password: '123456',
    userData: {
      id: 'hardcoded-user-1',
      name: 'Demo User',
      email: 'user@gmail.com',
      role: 'Actor',
      avatar: '/images/avatar.png',
      isLoggedIn: true
    }
  },
  admin: {
    email: 'admin@gmail.com',
    password: '123456',
    userData: {
      id: 'hardcoded-admin-1',
      name: 'Super Admin',
      email: 'admin@gmail.com',
      role: 'super_admin',
      avatar: '/images/avatar.png',
      isLoggedIn: true
    }
  }
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
  isLoading: false,
  error: null,
});

// Create custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Convert Firebase user to our User format
const formatUser = async (firebaseUser: FirebaseUser | null): Promise<User | null> => {
  if (!firebaseUser) return null;
  
  try {
    // Get additional user data from Firestore
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    
    return {
      id: firebaseUser.uid,
      name: userData?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
      email: firebaseUser.email || '',
      role: userData?.role || 'Actor',
      avatar: userData?.avatar || firebaseUser.photoURL || '/images/avatar.png',
      isLoggedIn: true
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
      email: firebaseUser.email || '',
      role: 'Actor',
      avatar: firebaseUser.photoURL || '/images/avatar.png',
      isLoggedIn: true
    };
  }
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    // Check for hardcoded user in localStorage first
    const savedUser = localStorage.getItem('hardcodedUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoading(false);
        return;
      } catch (err) {
        localStorage.removeItem('hardcodedUser');
      }
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const formattedUser = await formatUser(firebaseUser);
        setUser(formattedUser);
        
        if (formattedUser) {
          toast({
            title: "Welcome back!",
            description: `You are logged in as ${formattedUser.name}`,
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if credentials match hardcoded ones
      const emailLower = email.toLowerCase();
      if (emailLower === HARDCODED_CREDENTIALS.user.email && password === HARDCODED_CREDENTIALS.user.password) {
        // User login
        setUser(HARDCODED_CREDENTIALS.user.userData);
        if (rememberMe) {
          localStorage.setItem('hardcodedUser', JSON.stringify(HARDCODED_CREDENTIALS.user.userData));
        }
        toast({
          title: "Welcome back!",
          description: `You are logged in as ${HARDCODED_CREDENTIALS.user.userData.name}`,
        });
        return;
      }
      
      if (emailLower === HARDCODED_CREDENTIALS.admin.email && password === HARDCODED_CREDENTIALS.admin.password) {
        // Admin login with super_admin role
        setUser(HARDCODED_CREDENTIALS.admin.userData);
        if (rememberMe) {
          localStorage.setItem('hardcodedUser', JSON.stringify(HARDCODED_CREDENTIALS.admin.userData));
        }
        toast({
          title: "Welcome back, Super Admin!",
          description: `You are logged in as ${HARDCODED_CREDENTIALS.admin.userData.name}`,
        });
        return;
      }
      
      // If not hardcoded credentials, try Firebase authentication
      await signInWithEmailAndPassword(auth, email, password);
      
      if (rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
      } else {
        localStorage.removeItem('rememberLogin');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to login');
      toast({
        title: "Login failed",
        description: error.message || "Check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create the auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update the user's display name
      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: "/images/avatar.png"
      });
      
      // Create the user profile in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name,
        email,
        role: role || "Actor",
        avatar: "/images/avatar.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        verified: false,
        bio: `Hi, I'm ${name}! I'm a ${role || "Actor"} looking to connect with other film industry professionals.`,
        headline: `${role || "Actor"} | Available for Projects`,
        location: "Remote"
      });

      // Create initial skills based on role
      const defaultSkills = getDefaultSkillsForRole(role);
      if (defaultSkills.length > 0) {
        const skillsData = {
          skills: defaultSkills,
          createdAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'userSkills', firebaseUser.uid), skillsData);
      }

      toast({
        title: "Account created successfully!",
        description: "Welcome to CastLinker!",
      });
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
      toast({
        title: "Signup failed",
        description: error.message || "Please try again with different credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get default skills based on role
  const getDefaultSkillsForRole = (role: string): string[] => {
    switch (role) {
      case "Actor":
        return ["Method Acting", "Improvisation", "Voice Acting"];
      case "Director":
        return ["Shot Composition", "Script Analysis", "Team Leadership"];
      case "Producer":
        return ["Project Management", "Budgeting", "Team Coordination"];
      case "Screenwriter":
        return ["Story Development", "Character Creation", "Dialogue Writing"];
      case "Cinematographer":
        return ["Camera Operation", "Lighting", "Shot Composition"];
      case "Editor":
        return ["Video Editing", "Sound Editing", "Color Correction"];
      case "Sound Designer":
        return ["Sound Mixing", "Foley Art", "Audio Post-production"];
      case "Production Designer":
        return ["Set Design", "Art Direction", "Visual Storytelling"];
      default:
        return [];
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear hardcoded user from localStorage
      localStorage.removeItem('hardcodedUser');
      
      // Sign out from Firebase
      await signOut(auth);
      localStorage.removeItem('rememberLogin');
      
      // Clear user state
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while logging out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    signup,
    isLoading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
