import { useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/auth';
import { LoginResponse, User, UserPermission } from '@/types/auth';
import { getStoredUser, matchRoute, normalizeRoute } from './helpers';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await authService.login(email, password);
      setUser({
        userId: response.userId,
        email: response.email,
        routes: response.routes,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasPermission = (requiredPermission: UserPermission): boolean => {
    return !!user && user.routes.length > 0;
  };

  const hasRouteAccess = (route: string): boolean => {
    if (!user) return false;

    const normalizedRoute = normalizeRoute(route);

    return user.routes.some(p => matchRoute(p.route, normalizedRoute));
  };


  const hasWriteAccess = (route: string): boolean => {
    if (!user) return false;

    const normalizedRoute = normalizeRoute(route);

    const permission = user.routes.find(p => matchRoute(p.route, normalizedRoute));
    return permission?.writer ?? false;
  };


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
      canWriteToRoute,
    }}>
      {children}
    </AuthContext.Provider>
  );

};
