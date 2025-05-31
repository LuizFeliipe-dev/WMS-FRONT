
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '../services/auth';

// Types
export type UserPermission = 'initial' | 'second' | 'manager';

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

// Mock users for demo - will be removed when using the real API
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
    // Check if user and token are stored in localStorage
    try {
      const storedUser = localStorage.getItem('malldre_user');
      const token = localStorage.getItem('malldre_token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      // Limpa os dados inválidos
      localStorage.removeItem('malldre_user');
      localStorage.removeItem('malldre_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting API login...');
      // Tenta usar a API para login
      const response = await authService.login(email, password);
      console.log('API login successful:', response);
      
      // O token e usuário já são salvos dentro da função authService.login
      setUser(response.user);
      setIsLoading(false);
      return; // Return early since login was successful
    } catch (error) {
      console.log('API login failed, trying mock login for development');
      
      // Fallback para mock login em desenvolvimento
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Encontra usuário com email correspondente
          const foundUser = MOCK_USERS.find(u => u.email === email);
          
          if (foundUser && password === '123456') { // Mock password check
            console.log('Mock login successful');
            setUser(foundUser);
            localStorage.setItem('malldre_user', JSON.stringify(foundUser));
            localStorage.setItem('malldre_token', 'mock-token-for-development');
            setIsLoading(false);
            resolve();
          } else {
            console.log('Mock login failed');
            setIsLoading(false);
            reject(new Error('Email ou senha inválidos'));
          }
        }, 800); // Simula atraso de rede
      });
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // No navigating here, this should be handled in the UI components
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
