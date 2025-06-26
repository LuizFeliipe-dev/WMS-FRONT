import { useAuth } from '@/contexts/useAuth';
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthRequiredProps {
  children: ReactNode;
  requiredRoute?: string;
  requireWriteAccess?: boolean;
}

const AuthRequired = ({
  children,
  requiredRoute,
  requireWriteAccess = false,
}: AuthRequiredProps) => {
  const {
    isAuthenticated,
    isLoading,
    hasRouteAccess,
    hasWriteAccess,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } });
    } else if (requiredRoute) {
      const hasAccess = requireWriteAccess
        ? hasWriteAccess(requiredRoute)
        : hasRouteAccess(requiredRoute);

      if (!hasAccess) {
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, requiredRoute, requireWriteAccess, navigate, location, hasRouteAccess, hasWriteAccess]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 mb-4" />
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requiredRoute) {
    const hasAccess = requireWriteAccess
      ? hasWriteAccess(requiredRoute)
      : hasRouteAccess(requiredRoute);
    if (!hasAccess) return null;
  }

  return <>{children}</>;
};

export default AuthRequired;
