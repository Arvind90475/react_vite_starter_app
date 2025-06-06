import {
  AuthState,
  LoginCredentials,
  User,
  clearStoredUser,
  createAuthState,
  mockGetCurrentUser,
  mockLogin,
  mockLogout,
  storeUser,
  validateLoginCredentials,
} from "@/services/auth";
import { logger } from "@/services/logging/logger";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthContextType extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };
    case "AUTH_SUCCESS":
      return createAuthState(action.payload, false);
    case "AUTH_FAILURE":
      return createAuthState(null, false);
    case "LOGOUT":
      return createAuthState(null, false);
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(
    authReducer,
    createAuthState(null, true)
  );

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const validationErrors = validateLoginCredentials(credentials);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(", "));
    }

    dispatch({ type: "AUTH_START" });
    try {
      const user = await mockLogin(credentials);
      storeUser(user);
      logger.setUser({
        id: user.id,
        email: user.email,
      });
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await mockLogout();
      clearStoredUser();
      dispatch({ type: "LOGOUT" });
      logger.setUser(null);
    } catch (error) {
      logger.error("Logout failed", { error });
    }
  };

  useEffect(() => {
    (async () => {
      dispatch({ type: "AUTH_START" });
      try {
        const user = await mockGetCurrentUser();
        if (user) {
          dispatch({ type: "AUTH_SUCCESS", payload: user });
          logger.setUser({
            id: user.id,
            email: user.email,
          });
        } else {
          dispatch({ type: "AUTH_FAILURE" });
          logger.setUser(null);
        }
      } catch (error) {
        logger.error("Auth check failed", { error });
        dispatch({ type: "AUTH_FAILURE" });
        logger.setUser(null);
      }
    })();
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
