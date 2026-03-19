import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Header from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";
import { CacheService } from "@/lib/api/client";

const mockNavigate = jest.fn();
const mockLogout = jest.fn();
const mockLogin = jest.fn();
const mockToggleDarkMode = jest.fn();
const mockTriggerAlert = jest.fn();
const mockCreateElement = React.createElement;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("@/hooks/auth/useAuth", () => ({ useAuth: jest.fn() }));
jest.mock("@/hooks/theme/useDarkMode", () => ({ useDarkMode: jest.fn() }));
jest.mock("@/hooks/alerts/useOptionalGlobalAlert", () => ({ useOptionalGlobalAlert: jest.fn() }));
jest.mock("@/lib/api/client", () => ({
  CacheService: { deleteV1AlbumCache: jest.fn() },
}));
jest.mock("@/components/shared/ThemeToggle", () => ({
  __esModule: true,
  default: ({ onToggle }: { onToggle: () => void }) =>
    mockCreateElement("button", { type: "button", onClick: onToggle }, "Toggle theme"),
}));

describe("components/layout/Header.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin.mockResolvedValue(undefined),
      logout: mockLogout.mockResolvedValue(undefined),
    });
    (useDarkMode as jest.Mock).mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: mockToggleDarkMode,
    });
    (useOptionalGlobalAlert as jest.Mock).mockReturnValue({
      triggerAlert: mockTriggerAlert,
    });
    (CacheService.deleteV1AlbumCache as jest.Mock).mockResolvedValue(undefined);
  });

  test("renders the header title and navigates from the logo", () => {
    render(mockCreateElement(Header, { text: "Admin Dashboard" }));

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("logs out through the auth provider", () => {
    render(mockCreateElement(Header, { text: "Admin Dashboard" }));

    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });

  test("supports a login action without clear-cache controls", () => {
    render(
      mockCreateElement(Header, {
        text: "Unauthorized",
        showClearCacheButton: false,
        authActionLabel: "Login",
      })
    );

    expect(screen.queryByTestId("clear-cache-button")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Login"));
    expect(mockLogin).toHaveBeenCalled();
  });

  test("uses login instead of navigation when clicking the logo in login mode", () => {
    render(
      mockCreateElement(Header, {
        text: "Unauthorized",
        showClearCacheButton: false,
        authActionLabel: "Login",
      })
    );

    fireEvent.click(screen.getByRole("link"));
    expect(mockLogin).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith("/");
  });

  test("toggles theme and clears cache successfully", async () => {
    render(mockCreateElement(Header, { text: "Admin Dashboard" }));

    fireEvent.click(screen.getByText("Toggle theme"));
    expect(mockToggleDarkMode).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("clear-cache-button"));
    await waitFor(() =>
      expect(CacheService.deleteV1AlbumCache).toHaveBeenCalled()
    );
    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "Cache cleared successfully",
      "success"
    );
  });
});
