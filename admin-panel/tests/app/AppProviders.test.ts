import React from "react";
import { render, screen } from "@testing-library/react";
import { AppProviders } from "@/app/AppProviders";

const mockCreateElement = React.createElement;

jest.mock("@/providers/auth/AuthProvider", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) =>
    mockCreateElement("div", { "data-testid": "auth-provider" }, children),
}));

jest.mock("@/providers/theme/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) =>
    mockCreateElement("div", { "data-testid": "theme-provider" }, children),
}));

jest.mock("@/providers/alerts/GlobalAlertProvider", () => ({
  GlobalAlertProvider: ({ children }: { children: React.ReactNode }) =>
    mockCreateElement("div", { "data-testid": "alert-provider" }, children),
}));

describe("app/AppProviders.tsx", () => {
  test("nests auth, theme, and alert providers around children", () => {
    render(
      mockCreateElement(
        AppProviders,
        null,
        mockCreateElement("div", null, "Inner app")
      )
    );

    const auth = screen.getByTestId("auth-provider");
    const theme = screen.getByTestId("theme-provider");
    const alert = screen.getByTestId("alert-provider");

    expect(theme).toContainElement(auth);
    expect(auth).toContainElement(alert);
    expect(alert).toHaveTextContent("Inner app");
  });
});
