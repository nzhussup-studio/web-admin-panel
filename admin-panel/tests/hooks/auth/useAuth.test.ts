import React from "react";
import { renderHook } from "@testing-library/react";
import { useAuth } from "@/hooks/auth/useAuth";
import { AuthContext } from "@/providers/auth/auth-context";

const mockContextValue = {
  state: {
    isAuthenticated: true,
    token: "token-1",
    expiration: "123",
    loading: false,
    roles: ["ROLE_ADMIN"],
    username: "admin",
    email: "admin@example.com",
  },
  login: jest.fn().mockResolvedValue(undefined),
  logout: jest.fn().mockResolvedValue(undefined),
};

describe("hooks/auth/useAuth.ts", () => {
  test("returns the auth context when provided", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthContext.Provider, { value: mockContextValue }, children);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBe(mockContextValue);
  });

  test("throws outside the provider", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider"
    );

    consoleErrorSpy.mockRestore();
  });
});
