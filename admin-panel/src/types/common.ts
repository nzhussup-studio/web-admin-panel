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
