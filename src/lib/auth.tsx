
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '../services/auth';
import { User, RoutePermission, LoginResponse } from '../types/auth';

// Legacy permission type for backward compatibility
export type UserPermission = 'initial' | 'second' | 'manager';

interface AuthContextType {
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

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to normalize routes by removing leading/trailing slashes
const normalizeRoute = (route: string): string => {
  return route.replace(/^\/+|\/+$/g, '');
};

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
        const parsedUser = JSON.parse(storedUser);

        // Validate user structure
        if (parsedUser.userId && parsedUser.email && Array.isArray(parsedUser.routes)) {
          setUser(parsedUser);
        } else {
          // Clear invalid data
          localStorage.removeItem('malldre_user');
          localStorage.removeItem('malldre_token');
        }
      } else {
        console.log('No stored user or token found');
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
      const response: LoginResponse = await authService.login(email, password);

      // Create user object from response
      const userData: User = {
        userId: response.userId,
        email: response.email,
        routes: response.routes
      };

      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error; // Re-throw the error so it can be handled by the UI
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // No navigating here, this should be handled in the UI components
  };

  // Legacy permission system for backward compatibility
  const hasPermission = (requiredPermission: UserPermission): boolean => {
    if (!user) return false;

    // For now, if user has access to any route, assume they have permissions
    // You can implement more specific logic based on your requirements
    return user.routes.length > 0;
  };

  // Check if user has access to a specific route
  const hasRouteAccess = (route: string): boolean => {
    if (!user) {
      return false;
    }

    // Normalize the requested route
    const normalizedRoute = normalizeRoute(route);

    const hasAccess = user.routes.some(permission => {
      const normalizedPermissionRoute = normalizeRoute(permission.route);

      // Check for exact match first
      if (normalizedPermissionRoute === normalizedRoute) {
        return true;
      }

      // Check if the permission route is a prefix of the requested route
      // This handles cases where user has 'product' permission and requests 'product/specific-action'
      if (normalizedRoute.startsWith(normalizedPermissionRoute + '/')) {
        return true;
      }

      return false;
    });

    return hasAccess || route === 'load-history';
  };

  // Check if user has write access to a route
  const hasWriteAccess = (route: string): boolean => {
    if (!user) {
      return false;
    }

    const normalizedRoute = normalizeRoute(route);

    const routePermission = user.routes.find(permission => {
      const normalizedPermissionRoute = normalizeRoute(permission.route);

      // Check for exact match first
      if (normalizedPermissionRoute === normalizedRoute) {
        return true;
      }

      // Check if the permission route is a prefix of the requested route
      if (normalizedRoute.startsWith(normalizedPermissionRoute + '/')) {
        return true;
      }

      return false;
    });

    const hasWrite = routePermission ? routePermission.writer : false;
    return hasWrite;
  };

  // Alias for hasWriteAccess for better naming
  const canWriteToRoute = (route: string): boolean => {
    return hasWriteAccess(route);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      hasPermission,
      hasRouteAccess,
      hasWriteAccess,
      canWriteToRoute
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
