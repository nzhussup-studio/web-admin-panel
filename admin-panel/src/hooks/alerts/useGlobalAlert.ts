import { useContext } from "react";
import { GlobalAlertContext } from "@/providers/alerts/global-alert-context";

export const useGlobalAlert = () => {
  const context = useContext(GlobalAlertContext);

  if (!context) {
    throw new Error("useGlobalAlert must be used within a GlobalAlertProvider");
  }

  return context;
};
