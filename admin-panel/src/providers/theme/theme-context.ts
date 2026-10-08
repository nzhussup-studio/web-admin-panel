import { createContext } from "react";

export interface DarkModeContextValue {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<DarkModeContextValue | undefined>(
  undefined,
);
