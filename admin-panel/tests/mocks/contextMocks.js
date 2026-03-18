import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@/providers/theme/ThemeProvider";
import { GlobalAlertProvider } from "@/providers/alerts/GlobalAlertProvider";

// Mock context providers
export const mockDarkModeContext = {
  useDarkMode: jest.fn(() => ({
    isDarkMode: false,
    toggleDarkMode: jest.fn(),
  })),
  DarkModeProvider: ({ children }) => <div>{children}</div>,
};

export const mockGlobalAlertContext = {
  useGlobalAlert: jest.fn(() => ({ showAlert: jest.fn() })),
  GlobalAlertProvider: ({ children }) => <div>{children}</div>,
};

// Mock clipboard API
export const mockClipboard = {
  writeText: jest.fn(),
};

// Helper function for rendering with providers
export const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      <GlobalAlertProvider>{component}</GlobalAlertProvider>
    </ThemeProvider>
  );
};
