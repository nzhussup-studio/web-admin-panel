import { createContext } from "react";
import type { GlobalAlertContextValue } from "@/types/common";

export const GlobalAlertContext = createContext<
  GlobalAlertContextValue | undefined
>(undefined);
