import { useEffect, useRef, useState } from "react";
import { GlobalAlertContext } from "@/providers/alerts/global-alert-context";
import type {
  AlertVariant,
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerAlert = (message: string, type: AlertVariant = "success") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAlert({ show: true, message, type });
    timeoutRef.current = setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const closeAlert = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAlert((prev) => ({ ...prev, show: false }));
  };

  return (
    <GlobalAlertContext.Provider value={{ alert, triggerAlert, closeAlert }}>
      {children}
    </GlobalAlertContext.Provider>
  );
};
