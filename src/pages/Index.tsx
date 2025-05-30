
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-blue-100 mb-4"></div>
        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default Index;
