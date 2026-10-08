import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { GlobalAlertContext } from "@/providers/alerts/global-alert-context";
import type { AlertVariant, GlobalAlertState } from "./global-alert-context";

const initialAlert: GlobalAlertState = {
  id: 0,
  show: false,
  message: "",
  type: "success",
};

export const GlobalAlertProvider = ({ children }: PropsWithChildren) => {
  const [alerts, setAlerts] = useState<GlobalAlertState[]>([]);
  const nextId = useRef(1);

  const triggerAlert = useCallback(
    (message: string, type: AlertVariant = "success") => {
      const cleanMessage = message.trim();
      if (!cleanMessage) return;

      const nextAlert = {
        id: nextId.current++,
        show: true,
        message: cleanMessage,
        type,
      };
      setAlerts((current) =>
        current.length >= 5
          ? [current[0], ...current.slice(-3), nextAlert]
          : [...current, nextAlert],
      );
    },
    [],
  );

  const closeAlert = useCallback(() => {
    setAlerts((current) => current.slice(1));
  }, []);

  const alert = alerts[0] ?? initialAlert;
  const contextValue = useMemo(
    () => ({ alert, triggerAlert, closeAlert }),
    [alert, closeAlert, triggerAlert],
  );

  return (
    <GlobalAlertContext.Provider value={contextValue}>
      {children}
    </GlobalAlertContext.Provider>
  );
};
