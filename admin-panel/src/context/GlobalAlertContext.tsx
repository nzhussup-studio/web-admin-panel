import { createContext, useCallback, useContext, useState } from "react";
import type {
  GlobalAlertContextValue,
  GlobalAlertState,
  ProviderProps,
} from "../types/app";

const initialAlert: GlobalAlertState = {
  show: false,
  message: "",
  type: "success",
};

const GlobalAlertContext = createContext<GlobalAlertContextValue | undefined>(
  undefined
);

export const GlobalAlertProvider = ({ children }: ProviderProps) => {
  const [alert, setAlert] = useState<GlobalAlertState>(initialAlert);

  const triggerAlert = useCallback((message: string, type = "success") => {
    setAlert({ show: false, message: "", type });
    setTimeout(() => {
      setAlert({ show: true, message, type });
    }, 10);
  }, []);

  const closeAlert = () => setAlert((prev) => ({ ...prev, show: false }));

  return (
    <GlobalAlertContext.Provider value={{ alert, triggerAlert, closeAlert }}>
      {children}
    </GlobalAlertContext.Provider>
  );
};

export const useGlobalAlert = () => {
  const context = useContext(GlobalAlertContext);

  if (!context) {
    throw new Error(
      "useGlobalAlert must be used within a GlobalAlertProvider"
    );
  }

  return context;
};
