import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Types
type UserPermission = 'initial' | 'second' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  permission: UserPermission;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredPermission: UserPermission) => boolean;
}

// Mock users for demo
const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Usuário Básico', 
    email: 'basic@malldre.com', 
    permission: 'initial' 
  },
  { 
    id: '2', 
    name: 'Usuário Intermediário', 
    email: 'mid@malldre.com', 
    permission: 'second' 
  },
  { 
    id: '3', 
    name: 'Gerente', 
    email: 'manager@malldre.com', 
    permission: 'manager' 
  },
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('malldre_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Find user with matching email
        const foundUser = MOCK_USERS.find(u => u.email === email);
        
        if (foundUser && password === '123456') { // Mock password check
          setUser(foundUser);
          localStorage.setItem('malldre_user', JSON.stringify(foundUser));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Email ou senha inválidos'));
        }
      }, 800); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('malldre_user');
  };

  const hasPermission = (requiredPermission: UserPermission): boolean => {
    if (!user) return false;
    
    // Manager has access to everything
    if (user.permission === 'manager') return true;
    
    // Second level can access initial level
    if (user.permission === 'second' && requiredPermission === 'initial') return true;
    
    // Otherwise, permissions must match exactly
    return user.permission === requiredPermission;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy context use
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
