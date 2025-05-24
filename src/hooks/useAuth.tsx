
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  AuthState, 
  User, 
  LoginCredentials, 
  createAuthState, 
  validateLoginCredentials,
  mockLogin,
  mockLogout,
  mockGetCurrentUser,
  storeUser,
  clearStoredUser
} from '@/services/auth';
import { logger } from '@/services/logger';

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface AuthContextType extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return createAuthState(action.payload, false);
    case 'AUTH_FAILURE':
      return createAuthState(null, false);
    case 'LOGOUT':
      return createAuthState(null, false);
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, createAuthState(null, true));

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const validationErrors = validateLoginCredentials(credentials);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    dispatch({ type: 'AUTH_START' });
    try {
      const user = await mockLogin(credentials);
      storeUser(user);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await mockLogout();
      clearStoredUser();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      logger.error('Logout failed', { error });
    }
  };

  const checkAuth = async (): Promise<void> => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await mockGetCurrentUser();
      if (user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }
    } catch (error) {
      logger.error('Auth check failed', { error });
      dispatch({ type: 'AUTH_FAILURE' });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
