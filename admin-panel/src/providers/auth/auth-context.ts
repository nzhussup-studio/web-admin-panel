import { createContext } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  expiration: string | null;
  loading: boolean;
  roles: string[];
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface AuthContextValue {
  state: AuthState;
  login: () => Promise<void>;
  logout: (redirectUri?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
