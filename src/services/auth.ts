
import { logger } from './logger';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Auth utility functions (pure functions)
export const createAuthState = (
  user: User | null = null,
  isLoading: boolean = false
): AuthState => ({
  user,
  isAuthenticated: user !== null,
  isLoading,
});

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateLoginCredentials = (credentials: LoginCredentials): string[] => {
  const errors: string[] = [];
  
  if (!credentials.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(credentials.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!credentials.password) {
    errors.push('Password is required');
  } else if (credentials.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return errors;
};

// Mock auth API functions (replace with real API calls)
export const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  logger.info('Attempting login', { email: credentials.email });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (credentials.email === 'user@example.com' && credentials.password === 'password') {
    const user: User = {
      id: '1',
      email: credentials.email,
      name: 'John Doe',
      role: 'user',
    };
    
    logger.info('Login successful', { userId: user.id });
    return user;
  }
  
  logger.warn('Login failed', { email: credentials.email });
  throw new Error('Invalid credentials');
};

export const mockLogout = async (): Promise<void> => {
  logger.info('User logged out');
  await new Promise(resolve => setTimeout(resolve, 500));
};

export const mockGetCurrentUser = async (): Promise<User | null> => {
  // Simulate checking stored session
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      logger.error('Failed to parse stored user', { error });
      localStorage.removeItem('auth_user');
    }
  }
  return null;
};

// Storage utilities
export const storeUser = (user: User): void => {
  localStorage.setItem('auth_user', JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  localStorage.removeItem('auth_user');
};
