
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Extend the User type to include the fields our app needs
export interface ExtendedUser extends User {
  name?: string;
  avatar?: string;
  role?: string;
}

interface AuthContextProps {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading for compatibility
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut for compatibility
  login: (email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>; // Alias for signIn for compatibility
  signup: (email: string, password: string, userData?: Record<string, any>) => Promise<{
    success: boolean;
    error?: string;
  }>; // Alias for signUp for compatibility
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          // Fetch user profile data to get additional fields
          try {
            const { data: profileData, error } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
            
            if (profileData) {
              // Create extended user with profile data
              const extendedUser: ExtendedUser = {
                ...newSession.user,
                name: profileData.full_name,
                avatar: profileData.avatar_url,
                role: profileData.role
              };
              setUser(extendedUser);
            } else {
              setUser(newSession.user);
            }
          } catch (err) {
            console.error("Error fetching profile:", err);
            setUser(newSession.user);
          }
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Fetch user profile data
        try {
          const { data: profileData, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          if (profileData) {
            // Create extended user with profile data
            const extendedUser: ExtendedUser = {
              ...currentSession.user,
              name: profileData.full_name,
              avatar: profileData.avatar_url,
              role: profileData.role
            };
            setUser(extendedUser);
          } else {
            setUser(currentSession.user);
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          setUser(currentSession.user);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Signed in successfully",
        variant: "default",
      });
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message || "Failed to sign in",
      };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData?: Record<string, any>
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
        },
      });

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Signed up successfully",
        description: "Please check your email for a confirmation link.",
        variant: "default",
      });
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message || "Failed to sign up",
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Create alias functions for compatibility
  const login = signIn;
  const signup = signUp;
  const logout = signOut;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLoading: loading, // Alias for compatibility
        signIn,
        login, // Alias for signIn
        signUp,
        signup, // Alias for signUp
        signOut,
        logout, // Alias for signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
