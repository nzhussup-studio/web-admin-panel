import React from "react";
import { renderHook } from "@testing-library/react";
import { AuthContext } from "@/providers/auth/auth-context";

describe("providers/auth/auth-context.ts", () => {
  test("defaults to undefined and can provide a context value", () => {
    const { result: defaultResult } = renderHook(() => React.useContext(AuthContext));
    expect(defaultResult.current).toBeUndefined();

    const value = {
      state: {
        isAuthenticated: true,
        token: "abc",
        expiration: "123",
        loading: false,
        roles: ["ROLE_ADMIN"],
        username: "admin",
        email: "admin@example.com",
      },
      login: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn().mockResolvedValue(undefined),
    };
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthContext.Provider, { value }, children);

    const { result } = renderHook(() => React.useContext(AuthContext), { wrapper });
    expect(result.current).toBe(value);
  });
});
