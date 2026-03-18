import { useCallback, useState } from "react";
import { GlobalAlertContext } from "@/providers/alerts/global-alert-context";
import type {
  GlobalAlertState,
  ProviderProps,
} from "@/types/common";

const initialAlert: GlobalAlertState = {
  show: false,
  message: "",
  type: "success",
};

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
