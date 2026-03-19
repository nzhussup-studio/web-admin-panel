import React from "react";
import { renderHook } from "@testing-library/react";
import { ThemeContext } from "@/providers/theme/theme-context";

describe("providers/theme/theme-context.ts", () => {
  test("defaults to undefined and can provide a context value", () => {
    const { result: defaultResult } = renderHook(() => React.useContext(ThemeContext));
    expect(defaultResult.current).toBeUndefined();

    const value = {
      isDarkMode: true,
      toggleDarkMode: jest.fn(),
    };
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(ThemeContext.Provider, { value }, children);

    const { result } = renderHook(() => React.useContext(ThemeContext), { wrapper });
    expect(result.current).toBe(value);
  });
});
