import React from "react";
import { renderHook } from "@testing-library/react";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";
import { GlobalAlertContext } from "@/providers/alerts/global-alert-context";

const mockContextValue = {
  alert: { show: true, message: "Saved", type: "success" as const },
  triggerAlert: jest.fn(),
  closeAlert: jest.fn(),
};

describe("hooks/alerts/useOptionalGlobalAlert.ts", () => {
  test("returns the alert context when provided", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        GlobalAlertContext.Provider,
        { value: mockContextValue },
        children
      );

    const { result } = renderHook(() => useOptionalGlobalAlert(), { wrapper });

    expect(result.current).toBe(mockContextValue);
  });

  test("returns a safe fallback outside the provider", () => {
    const { result } = renderHook(() => useOptionalGlobalAlert());

    expect(result.current.alert).toEqual({
      show: false,
      message: "",
      type: "info",
    });
    expect(() => result.current.triggerAlert("Hello", "danger")).not.toThrow();
    expect(() => result.current.closeAlert()).not.toThrow();
  });
});
