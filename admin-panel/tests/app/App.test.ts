import React from "react";
import { render, screen } from "@testing-library/react";
import App from "@/app/App";

const mockCreateElement = React.createElement;

jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    mockCreateElement("div", { "data-testid": "animate-presence" }, children),
}));

jest.mock("react-router-dom", () => ({
  Routes: ({ children }: { children: React.ReactNode }) =>
    mockCreateElement("div", { "data-testid": "routes" }, children),
  Route: ({ path, element }: { path: string; element: React.ReactNode }) =>
    mockCreateElement("div", { "data-testid": `route-${path}` }, element),
  useLocation: () => ({ pathname: "/projects" }),
}));

jest.mock("@/router/routes", () => ({
  __esModule: true,
  default: [
    {
      path: "/",
      component: () => mockCreateElement("div", null, "Home"),
      isProtected: true,
    },
    {
      path: "/login",
      component: () => mockCreateElement("div", null, "Login"),
      isProtected: false,
    },
  ],
}));

jest.mock("@/router/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) =>
    mockCreateElement("div", { "data-testid": "protected-route" }, children),
}));

jest.mock("@/components/layout/GlobalAlert", () => ({
  __esModule: true,
  default: () => mockCreateElement("div", { "data-testid": "global-alert" }, "Alert"),
}));

jest.mock("@/motion/PageTransition", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) =>
    mockCreateElement("div", { "data-testid": "page-transition" }, children),
}));

describe("app/App.tsx", () => {
  test("renders the global alert and wraps routed content", () => {
    render(mockCreateElement(App));

    expect(screen.getByTestId("global-alert")).toBeInTheDocument();
    expect(screen.getByTestId("animate-presence")).toBeInTheDocument();
    expect(screen.getAllByTestId("page-transition")).toHaveLength(2);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("wraps only protected routes with ProtectedRoute", () => {
    render(mockCreateElement(App));

    expect(screen.getByTestId("route-/")).toContainElement(
      screen.getByTestId("protected-route")
    );
    expect(screen.getByTestId("route-/login")).not.toContainElement(
      screen.queryByTestId("protected-route")
    );
  });
});
