import { useLayoutEffect, useState } from "react";
import { ThemeContext } from "@/providers/theme/theme-context";
import type { ProviderProps } from "@/types/common";

const THEME_STORAGE_KEY = "isDarkMode";

const getStoredDarkMode = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (!savedTheme) {
    return false;
  }

  try {
    return JSON.parse(savedTheme) === true;
  } catch {
    return false;
  }
};

const applyTheme = (isDarkMode: boolean) => {
  document.documentElement.setAttribute(
    "data-bs-theme",
    isDarkMode ? "dark" : "light",
  );
  document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
};

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getStoredDarkMode);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newMode));
      return newMode;
    });
  };

  useLayoutEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
