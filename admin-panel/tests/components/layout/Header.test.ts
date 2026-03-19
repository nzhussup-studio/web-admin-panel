import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Header from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDarkMode } from "@/hooks/theme/useDarkMode";
import { useGlobalAlert } from "@/hooks/alerts/useGlobalAlert";
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
jest.mock("@/hooks/alerts/useGlobalAlert", () => ({ useGlobalAlert: jest.fn() }));
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
    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
    (useDarkMode as jest.Mock).mockReturnValue({
      isDarkMode: false,
      toggleDarkMode: mockToggleDarkMode,
    });
    (useGlobalAlert as jest.Mock).mockReturnValue({
      alert: { show: false, message: "", type: "success" },
      triggerAlert: mockTriggerAlert,
      closeAlert: jest.fn(),
    });
    (CacheService.deleteV1AlbumCache as jest.Mock).mockResolvedValue(undefined);
  });

  test("renders the header title and navigates from the logo", () => {
    render(mockCreateElement(Header, { text: "Admin Dashboard" }));

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("logs out and navigates to login", () => {
    render(mockCreateElement(Header, { text: "Admin Dashboard" }));

    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
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
