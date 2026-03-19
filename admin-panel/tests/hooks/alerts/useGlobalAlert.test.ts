import React from "react";
import { renderHook } from "@testing-library/react";
import { useGlobalAlert } from "@/hooks/alerts/useGlobalAlert";
import { GlobalAlertContext } from "@/providers/alerts/global-alert-context";

const mockContextValue = {
  alert: { show: true, message: "Saved", type: "success" as const },
  triggerAlert: jest.fn(),
  closeAlert: jest.fn(),
};

describe("hooks/alerts/useGlobalAlert.ts", () => {
  test("returns the alert context when provided", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        GlobalAlertContext.Provider,
        { value: mockContextValue },
        children
      );

    const { result } = renderHook(() => useGlobalAlert(), { wrapper });

    expect(result.current).toBe(mockContextValue);
  });

  test("throws outside the provider", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useGlobalAlert())).toThrow(
      "useGlobalAlert must be used within a GlobalAlertProvider"
    );

    consoleErrorSpy.mockRestore();
  });
});
