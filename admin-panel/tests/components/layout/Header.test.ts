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
jest.mock("@/components/shared/ConfirmDialog", () => ({
  __esModule: true,
  default: ({
    isOpen,
    title,
    message,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    title?: string;
    message?: string;
    onClose: () => void;
    onConfirm: () => void;
  }) =>
    isOpen
      ? mockCreateElement(
          "div",
          null,
          mockCreateElement("div", null, title),
          mockCreateElement("div", null, message),
          mockCreateElement("button", { type: "button", onClick: onClose }, "Cancel"),
          mockCreateElement("button", { type: "button", onClick: onConfirm }, "Confirm"),
        )
      : null,
}));

describe("components/layout/Header.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({
      state: {
        isAuthenticated: true,
        token: "token",
        expiration: "123",
        loading: false,
        roles: ["ROLE_ADMIN"],
        username: "admin",
        firstName: "Profile",
        lastName: "Focus",
        email: "admin@example.com",
      },
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
    expect(screen.getByText("PF")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("renders custom header content when provided", () => {
    render(
      mockCreateElement(Header, {
        titleContent: mockCreateElement("span", null, "Forbidden icon"),
      }),
    );

    expect(screen.getByText("Forbidden icon")).toBeInTheDocument();
  });

  test("logs out through the auth provider after confirmation", () => {
    render(mockCreateElement(Header, { text: "Admin Dashboard" }));

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    expect(
      screen.getByText("Are you sure you want to logout?")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Confirm"));
    expect(mockLogout).toHaveBeenCalled();
  });

  test("hides clear-cache controls when requested", () => {
    render(
      mockCreateElement(Header, {
        text: "Unauthorized",
        showClearCacheButton: false,
      })
    );

    expect(screen.queryByTestId("clear-cache-button")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    expect(
      screen.getByText("Are you sure you want to logout?")
    ).toBeInTheDocument();
  });

  test("navigates home when clicking the logo", () => {
    render(
      mockCreateElement(Header, {
        text: "Unauthorized",
        showClearCacheButton: false,
      })
    );

    fireEvent.click(screen.getByRole("link"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("toggles theme and clears cache successfully after confirmation", async () => {
    render(mockCreateElement(Header, { text: "Admin Dashboard" }));

    fireEvent.click(screen.getByText("Toggle theme"));
    expect(mockToggleDarkMode).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Clear cache" }));
    expect(
      screen.getByText("Are you sure you want to clear cache?")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() =>
      expect(CacheService.deleteV1AlbumCache).toHaveBeenCalled()
    );
    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "Cache cleared successfully",
      "success"
    );
  });
});
