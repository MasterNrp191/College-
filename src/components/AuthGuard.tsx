import { useAuth } from './AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

export function AuthGuard({ children, adminOnly = false }: { children: ReactNode, adminOnly?: boolean }) {
  const { user, loading, isAdmin, isEditor } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/portal" state={{ from: location }} replace />;
  }

  const isStaff = isAdmin || isEditor;

  if (adminOnly && !isStaff) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
