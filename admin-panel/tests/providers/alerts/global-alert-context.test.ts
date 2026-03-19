import React from "react";
import { renderHook } from "@testing-library/react";
import { GlobalAlertContext } from "@/providers/alerts/global-alert-context";

describe("providers/alerts/global-alert-context.ts", () => {
  test("defaults to undefined and can provide a context value", () => {
    const { result: defaultResult } = renderHook(() => React.useContext(GlobalAlertContext));
    expect(defaultResult.current).toBeUndefined();

    const value = {
      alert: { show: true, message: "Hello", type: "info" as const },
      triggerAlert: jest.fn(),
      closeAlert: jest.fn(),
    };
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(GlobalAlertContext.Provider, { value }, children);

    const { result } = renderHook(() => React.useContext(GlobalAlertContext), {
      wrapper,
    });
    expect(result.current).toBe(value);
  });
});
