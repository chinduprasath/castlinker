
import { useState, useEffect, createContext, useContext } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
} | null;

type AuthContextType = {
  user: User;
  login: (userData: any, remember?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  
  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const login = (userData: any, remember: boolean = false) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (remember) {
      localStorage.setItem('rememberLogin', 'true');
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberLogin');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
