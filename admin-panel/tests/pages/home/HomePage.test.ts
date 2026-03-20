import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "@/pages/home/HomePage";
import { navigateExternal } from "@/lib/navigation/external";
import { useAuth } from "@/hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";

const mockNavigate = jest.fn();
const mockNavigateExternal = navigateExternal as jest.MockedFunction<typeof navigateExternal>;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("@/lib/navigation/external", () => ({
  __esModule: true,
  navigateExternal: jest.fn(),
}));
jest.mock("@/hooks/auth/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement("div", null, `Header: ${text}`);
  },
}));

describe("pages/home/HomePage.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({
      state: {
        firstName: "Nurzhanat",
      },
    });
  });

  test("renders the dashboard sections and header", () => {
    render(React.createElement(HomePage));

    expect(
      screen.getByText("Header: Welcome to the Admin Panel, Nurzhanat!")
    ).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("CV")).toBeInTheDocument();
    expect(screen.getByText(/Manage .* Realm/)).toBeInTheDocument();
    expect(screen.getByText("Albums")).toBeInTheDocument();
    expect(screen.getByText("CV Generator")).toBeInTheDocument();
    expect(screen.getByText("LLM Config")).toBeInTheDocument();
  });

  test("navigates when a section card is clicked", () => {
    render(React.createElement(HomePage));

    fireEvent.click(screen.getByText("Projects"));
    expect(mockNavigate).toHaveBeenCalledWith("/projects");

    fireEvent.click(screen.getByText(/Manage .* Realm/));
    expect(mockNavigateExternal).toHaveBeenCalledWith(
      "http://localhost:8081/admin/backend-auth-dev/console"
    );

    fireEvent.click(screen.getByText("LLM Config"));
    expect(mockNavigate).toHaveBeenCalledWith("/llm");
  });
});
