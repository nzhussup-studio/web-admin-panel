import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "@/pages/auth/LoginPage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import { AuthControllerService } from "@/lib/api/client";

const mockNavigate = jest.fn();
const mockLogin = jest.fn();
const mockToggleDarkMode = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("@/hooks/auth/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/hooks/theme/useDarkMode", () => ({
  useDarkMode: jest.fn(),
}));

jest.mock("@/lib/api/client", () => ({
  AuthControllerService: {
    login: jest.fn(),
    validateToken: jest.fn(),
  },
}));

jest.mock("@/components/shared/ThemeToggle", () => ({
  __esModule: true,
  default: ({
    isDarkMode,
    onToggle,
  }: {
    isDarkMode: boolean;
    onToggle: () => void;
  }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement(
      "button",
      { type: "button", onClick: onToggle },
      isDarkMode ? "Dark enabled" : "Dark disabled"
    );
  },
}));

jest.mock("@/components/states/LoadingState", () => ({
  __esModule: true,
  default: () => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("div", null, "Loading...");
  },
}));

describe("pages/auth/LoginPage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    (useDarkMode as jest.Mock).mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: mockToggleDarkMode,
    });
  });

  test("renders the login form and toggles dark mode", () => {
    render(React.createElement(LoginPage));

    expect(screen.getByText("Please sign in")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Dark disabled"));
    expect(mockToggleDarkMode).toHaveBeenCalled();
  });

  test("logs in an admin and redirects to home", async () => {
    (AuthControllerService.login as jest.Mock).mockResolvedValue({
      token: "token-123",
      expiration: "2026-03-20T00:00:00.000Z",
    });
    (AuthControllerService.validateToken as jest.Mock).mockResolvedValue({
      roles: ["ROLE_ADMIN"],
    });

    render(React.createElement(LoginPage));

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() =>
      expect(AuthControllerService.login).toHaveBeenCalledWith({
        username: "admin",
        password: "secret",
      })
    );
    expect(mockLogin).toHaveBeenCalledWith(
      "token-123",
      "2026-03-20T00:00:00.000Z"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  test("shows an error when the user is not an admin", async () => {
    (AuthControllerService.login as jest.Mock).mockResolvedValue({
      token: "token-123",
      expiration: "2026-03-20T00:00:00.000Z",
    });
    (AuthControllerService.validateToken as jest.Mock).mockResolvedValue({
      roles: ["ROLE_USER"],
    });

    render(React.createElement(LoginPage));

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByText("Sign in"));

    expect(
      await screen.findByText("Only administrators can access this page.")
    ).toBeInTheDocument();
  });
});
