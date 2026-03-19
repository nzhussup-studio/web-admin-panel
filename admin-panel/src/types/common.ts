import type { ReactNode } from "react";

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  expiration: string | null;
  loading: boolean;
  roles: string[];
  username: string | null;
  email: string | null;
}

export interface AuthContextValue {
  state: AuthState;
  login: () => Promise<void>;
  logout: (redirectUri?: string) => Promise<void>;
}

export interface DarkModeContextValue {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export type AlertVariant = "success" | "danger" | "warning" | "info";

export interface GlobalAlertState {
  show: boolean;
  message: string;
  type: AlertVariant;
}

export interface GlobalAlertContextValue {
  alert: GlobalAlertState;
  triggerAlert: (message: string, type?: AlertVariant) => void;
  closeAlert: () => void;
}

export interface ProviderProps {
  children: ReactNode;
}
