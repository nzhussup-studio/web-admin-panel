import React from "react";
import { render, screen } from "@testing-library/react";
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
      },
      login: jest.fn(),
      logout: jest.fn(),
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

  test("redirects to login when the user is not authenticated", () => {
    mockUseAuth.mockReturnValue({
      state: {
        isAuthenticated: false,
        token: null,
        expiration: null,
        loading: false,
      },
      login: jest.fn(),
      logout: jest.fn(),
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
});
