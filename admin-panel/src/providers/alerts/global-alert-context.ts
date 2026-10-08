import { createContext } from "react";

export type AlertVariant = "success" | "danger" | "warning" | "info";

export interface GlobalAlertState {
  id: number;
  show: boolean;
  message: string;
  type: AlertVariant;
}

export interface GlobalAlertContextValue {
  alert: GlobalAlertState;
  triggerAlert: (message: string, type?: AlertVariant) => void;
  closeAlert: () => void;
}

export const GlobalAlertContext = createContext<
  GlobalAlertContextValue | undefined
>(undefined);
