import type { GlobalAlertContextValue } from "./global-alert-context";
import { useGlobalAlert } from "./useGlobalAlert";

const fallbackAlert: GlobalAlertContextValue = {
  alert: {
    id: 0,
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
