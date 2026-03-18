import type { ReactNode } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  expiration: string | null;
  loading: boolean;
}

export interface AuthContextValue {
  state: AuthState;
  login: (token: string, expiration: string) => void;
  logout: () => void;
}

export interface DarkModeContextValue {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface GlobalAlertState {
  show: boolean;
  message: string;
  type: string;
}

export interface GlobalAlertContextValue {
  alert: GlobalAlertState;
  triggerAlert: (message: string, type?: string) => void;
  closeAlert: () => void;
}

export interface RouteConfig {
  path: string;
  element: ReactNode;
  isProtected: boolean;
}

export interface ProviderProps {
  children: ReactNode;
}
