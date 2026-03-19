import React from "react";
import { renderHook } from "@testing-library/react";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import { ThemeContext } from "@/providers/theme/theme-context";

const mockContextValue = {
  isDarkMode: true,
  toggleDarkMode: jest.fn(),
};

describe("hooks/theme/useDarkMode.ts", () => {
  test("returns the theme context when provided", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeContext.Provider, { value: mockContextValue }, children);

    const { result } = renderHook(() => useDarkMode(), { wrapper });

    expect(result.current).toBe(mockContextValue);
  });

  test("throws outside the provider", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useDarkMode())).toThrow(
      "useDarkMode must be used within a ThemeProvider"
    );

    consoleErrorSpy.mockRestore();
  });
});
