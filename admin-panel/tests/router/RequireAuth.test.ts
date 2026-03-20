import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RequireAuth from "@/router/RequireAuth";
import { useAuth } from "@/hooks/auth/useAuth";

jest.mock("@/hooks/auth/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("router/RequireAuth.tsx", () => {
  test("renders children when the user is authenticated", () => {
    mockUseAuth.mockReturnValue({
      state: {
        isAuthenticated: true,
        token: "token",
        expiration: "tomorrow",
        loading: false,
        roles: ["ROLE_ADMIN"],
        username: "admin",
        firstName: "Admin",
        lastName: "User",
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
          RequireAuth,
          null,
          React.createElement("div", null, "Private content")
        )
      )
    );

    expect(screen.getByText("Private content")).toBeInTheDocument();
  });

  test("redirects to forbidden when the user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      state: {
        isAuthenticated: false,
        token: null,
        expiration: null,
        loading: false,
        roles: [],
        username: null,
        firstName: null,
        lastName: null,
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
          RequireAuth,
          null,
          React.createElement("div", null, "Hidden content")
        )
      )
    );

    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    expect(window.location.pathname).not.toBe("/projects");
  });
});
