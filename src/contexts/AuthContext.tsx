
import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
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

// Convert Supabase user to our User format
const formatUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
    email: supabaseUser.email || '',
    role: supabaseUser.user_metadata?.role || 'Actor',
    avatar: supabaseUser.user_metadata?.avatar_url || '/images/avatar.png',
    isLoggedIn: true
  };
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    // First set up the auth state listener to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const formattedUser = formatUser(session?.user || null);
        setUser(formattedUser);
        setIsLoading(false);
        
        if (event === 'SIGNED_IN' && formattedUser) {
          toast({
            title: "Welcome back!",
            description: `You are logged in as ${formattedUser.name}`,
          });
        }
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been logged out successfully",
          });
        }
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data.session) {
          const formattedUser = formatUser(data.session.user);
          setUser(formattedUser);
        }
      } catch (err) {
        console.error('Error checking auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [toast]);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: role || "Actor",
            avatar_url: "/images/avatar.png"
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to CastLinker!",
        });
      }
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

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('rememberLogin');
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
