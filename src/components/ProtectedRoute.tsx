import React, { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // no-op: App already redirects based on auth state; this component only displays appropriate UI
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Redirecting to login…</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
