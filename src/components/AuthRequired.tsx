
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { UserPermission } from '../types/auth';

interface AuthRequiredProps {
  children: ReactNode;
  requiredPermission?: UserPermission;
}

const AuthRequired = ({ 
  children, 
  requiredPermission = 'initial' 
}: AuthRequiredProps) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (!isLoading && isAuthenticated && !hasPermission(requiredPermission)) {
      navigate('/unauthorized', { replace: true });
    }
  }, [isAuthenticated, isLoading, hasPermission, requiredPermission, navigate]);

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

  if (!hasPermission(requiredPermission)) {
    return null; // Will redirect to unauthorized
  }

  return <>{children}</>;
};

export default AuthRequired;
