import { createContext } from "react";
import type { DarkModeContextValue } from "@/types/common";

export const ThemeContext = createContext<DarkModeContextValue | undefined>(
  undefined,
);
