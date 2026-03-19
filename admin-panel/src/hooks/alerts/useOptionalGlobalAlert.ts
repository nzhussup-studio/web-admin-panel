import type { GlobalAlertContextValue } from "@/types/common";
import { useGlobalAlert } from "@/hooks/alerts/useGlobalAlert";

const fallbackAlert: GlobalAlertContextValue = {
  alert: {
    show: false,
    message: "",
    type: "info",
  },
  triggerAlert: () => {},
  closeAlert: () => {},
};

export const useOptionalGlobalAlert = () => {
  try {
    return useGlobalAlert();
  } catch {
    return fallbackAlert;
  }
};
