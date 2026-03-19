import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "@/router/ProtectedRoute";
import { useAuth } from "@/hooks/auth/useAuth";

jest.mock("@/hooks/auth/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("router/ProtectedRoute.tsx", () => {
  test("renders children when the user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      state: {
        isAuthenticated: true,
        token: "token",
        expiration: "tomorrow",
        loading: false,
        roles: ["ROLE_ADMIN"],
        username: "admin",
        email: "admin@example.com",
      },
      login: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn().mockResolvedValue(undefined),
    });

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(
          ProtectedRoute,
          null,
          React.createElement("div", null, "Private content")
        )
      )
    );

    expect(screen.getByText("Private content")).toBeInTheDocument();
  });

  test("shows loading when the user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      state: {
        isAuthenticated: false,
        token: null,
        expiration: null,
        loading: false,
        roles: [],
        username: null,
        email: null,
      },
      login: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn().mockResolvedValue(undefined),
    });

    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/projects"] },
        React.createElement(
          ProtectedRoute,
          null,
          React.createElement("div", null, "Hidden content")
        )
      )
    );

    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  test("logs out authenticated users without the admin role", async () => {
    const logout = jest.fn().mockResolvedValue(undefined);

    mockUseAuth.mockReturnValue({
      state: {
        isAuthenticated: true,
        token: "token",
        expiration: "tomorrow",
        loading: false,
        roles: ["ROLE_USER"],
        username: "jane.user",
        email: "jane.user@example.com",
      },
      login: jest.fn().mockResolvedValue(undefined),
      logout,
    });

    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(
          ProtectedRoute,
          null,
          React.createElement("div", null, "Hidden content")
        )
      )
    );

    await waitFor(() =>
      expect(logout).toHaveBeenCalledWith(`${window.location.origin}/unauthorized`)
    );
  });
});
