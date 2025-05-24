
import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </ErrorBoundary>
    </div>
  );
};
