
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute, GuestOnlyRoute, PublicRoute } from "@/components/routing/RouteGuard";
import { LazyWrapper } from "@/components/ui/LazyWrapper";
import { createLazyComponent } from "@/utils/lazyLoading";

// Lazy load pages
const HomePage = createLazyComponent(() => import("@/pages/HomePage"), "HomePage");
const LoginPage = createLazyComponent(() => import("@/pages/LoginPage"), "LoginPage");
const SignupPage = createLazyComponent(() => import("@/pages/SignupPage"), "SignupPage");
const DashboardPage = createLazyComponent(() => import("@/pages/DashboardPage"), "DashboardPage");
const NotFoundPage = createLazyComponent(() => import("@/pages/NotFound"), "NotFoundPage");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <LazyWrapper>
                      <HomePage />
                    </LazyWrapper>
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/login" 
                element={
                  <GuestOnlyRoute>
                    <LazyWrapper>
                      <LoginPage />
                    </LazyWrapper>
                  </GuestOnlyRoute>
                } 
              />
              
              <Route 
                path="/signup" 
                element={
                  <GuestOnlyRoute>
                    <LazyWrapper>
                      <SignupPage />
                    </LazyWrapper>
                  </GuestOnlyRoute>
                } 
              />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <LazyWrapper>
                      <DashboardPage />
                    </LazyWrapper>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="*" 
                element={
                  <LazyWrapper>
                    <NotFoundPage />
                  </LazyWrapper>
                } 
              />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
      
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
