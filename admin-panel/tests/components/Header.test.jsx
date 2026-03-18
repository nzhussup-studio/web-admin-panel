import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "@/components/layout/Header";
import { AuthProvider } from "@/providers/auth/AuthProvider";
import { ThemeProvider } from "@/providers/theme/ThemeProvider";
import { GlobalAlertProvider } from "@/providers/alerts/GlobalAlertProvider";

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/hooks/auth/useAuth", () => ({
  ...jest.requireActual("@/hooks/auth/useAuth"),
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

jest.mock("@/lib/api/client", () => ({
  CacheService: {
    deleteV1AlbumCache: jest.fn(() => Promise.resolve()),
  },
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <GlobalAlertProvider>{component}</GlobalAlertProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe("Header Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogout.mockClear();
  });

  test("renders header text", () => {
    renderWithProviders(<Header text='Test Header' />);
    expect(screen.getByText("Test Header")).toBeInTheDocument();
  });

  test("navigates to home when logo is clicked", () => {
    renderWithProviders(<Header text='Test Header' />);
    const logo = screen.getByRole("link");
    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("handles logout", () => {
    renderWithProviders(<Header text='Test Header' />);
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("displays cache clear success message", async () => {
    const mockTriggerAlert = jest.fn();

    // Mock GlobalAlertContext
    jest
      .spyOn(require("@/hooks/alerts/useGlobalAlert"), "useGlobalAlert")
      .mockReturnValue({ triggerAlert: mockTriggerAlert });

    renderWithProviders(<Header text='Test Header' />);

    // Find and click the clear cache button
    const clearCacheButton = screen.getByTestId("clear-cache-button");
    await act(async () => {
      await fireEvent.click(clearCacheButton);
    });

    // Check if the success alert was triggered
    expect(mockTriggerAlert).toHaveBeenCalledWith(
      "Cache cleared successfully",
      "success"
    );
  });

  test("toggles dark mode", () => {
    renderWithProviders(<Header text='Test Header' />);
    const darkModeToggle = screen.getByLabelText("Toggle dark mode");
    fireEvent.click(darkModeToggle);
    // Note: Testing the actual dark mode state would require additional context testing
  });
});
