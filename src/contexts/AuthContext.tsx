import { createContext, useState, useContext, useEffect } from 'react';

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

// Auth Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would validate credentials against a backend API
      // For this demo, we're only checking if the email follows a valid format
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      // For demonstration, we're accepting any non-empty password
      if (!password.trim()) {
        throw new Error('Password cannot be empty');
      }
      
      // Create user object
      const userData: User = {
        id: Date.now().toString(),
        name: email.split('@')[0], // Use part of email as name for demo
        email,
        role: "Actor", // Default role
        avatar: "/images/avatar.png", // Default avatar
        isLoggedIn: true
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
      } else {
        localStorage.removeItem('rememberLogin');
      }
      
      setUser(userData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to login');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate inputs
      if (!name.trim()) {
        throw new Error('Name is required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Create user object
      const userData: User = {
        id: Date.now().toString(),
        name,
        email,
        role: role || "Actor", // Use provided role or default to Actor
        avatar: "/images/avatar.png", // Default avatar
        isLoggedIn: true
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create account');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('rememberLogin');
    setUser(null);
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