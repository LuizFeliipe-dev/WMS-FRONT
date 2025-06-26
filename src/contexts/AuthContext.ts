import { createContext } from 'react';
import { User, UserPermission } from '@/types/auth';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredPermission: UserPermission) => boolean;
  hasRouteAccess: (route: string) => boolean;
  hasWriteAccess: (route: string) => boolean;
  canWriteToRoute: (route: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
