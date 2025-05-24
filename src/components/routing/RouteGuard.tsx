
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireGuest?: boolean;
  redirectTo?: string;
}

export const RouteGuard = ({ 
  children, 
  requireAuth = false, 
  requireGuest = false,
  redirectTo 
}: RouteGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect authenticated users away from guest-only routes
  if (requireGuest && isAuthenticated) {
    return <Navigate to={redirectTo || '/dashboard'} replace />;
  }

  // Redirect unauthenticated users away from protected routes
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo || `/login?from=${location.pathname}`} replace />;
  }

  return <>{children}</>;
};

// Convenience components for common use cases
export const ProtectedRoute = ({ children, redirectTo }: { children: ReactNode; redirectTo?: string }) => (
  <RouteGuard requireAuth redirectTo={redirectTo}>
    {children}
  </RouteGuard>
);

export const GuestOnlyRoute = ({ children, redirectTo }: { children: ReactNode; redirectTo?: string }) => (
  <RouteGuard requireGuest redirectTo={redirectTo}>
    {children}
  </RouteGuard>
);

export const PublicRoute = ({ children }: { children: ReactNode }) => (
  <RouteGuard>
    {children}
  </RouteGuard>
);
