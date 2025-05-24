
import { Suspense, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight?: string;
}

export const LazyWrapper = ({ 
  children, 
  fallback,
  minHeight = 'min-h-[200px]'
}: LazyWrapperProps) => {
  const defaultFallback = (
    <div className={`flex items-center justify-center ${minHeight}`}>
      <LoadingSpinner size="lg" />
    </div>
  );

  return (
    <ErrorBoundary
      fallback={
        <div className={`flex items-center justify-center ${minHeight}`}>
          <div className="text-center">
            <p className="text-gray-600">Failed to load component</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      }
    >
      <Suspense fallback={fallback || defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
