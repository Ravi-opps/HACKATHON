import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { clearAuthSession, getAuthRole, getAuthToken } from '../lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const userRole = getAuthRole();
  const token = getAuthToken();

  if (!userRole || !token) {
    clearAuthSession();
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to their specific landing page if role not allowed
    const roleRedirects: Record<string, string> = {
      volunteer: '/volunteer',
      field: '/fieldworker',
      coordinator: '/map',
      admin: '/admin'
    };
    return <Navigate to={roleRedirects[userRole] || '/'} replace />;
  }

  return <>{children}</>;
}
