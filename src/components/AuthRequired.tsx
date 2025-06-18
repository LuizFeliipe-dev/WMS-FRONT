
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { UserPermission } from '../types/auth';

interface AuthRequiredProps {
  children: ReactNode;
  requiredPermission?: UserPermission;
  requiredRoute?: string;
}

const AuthRequired = ({ 
  children, 
  requiredPermission = 'initial',
  requiredRoute
}: AuthRequiredProps) => {
  const { isAuthenticated, isLoading, hasPermission, hasRouteAccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } });
    } else if (!isLoading && isAuthenticated) {
      // Check route-based permission if specified
      if (requiredRoute && !hasRouteAccess(requiredRoute)) {
        navigate('/unauthorized', { replace: true });
      } 
      // Fall back to legacy permission system
      else if (!requiredRoute && !hasPermission(requiredPermission)) {
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, hasPermission, hasRouteAccess, requiredPermission, requiredRoute, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (requiredRoute && !hasRouteAccess(requiredRoute)) {
    return null; // Will redirect to unauthorized
  }

  if (!requiredRoute && !hasPermission(requiredPermission)) {
    return null; // Will redirect to unauthorized
  }

  return <>{children}</>;
};

export default AuthRequired;
