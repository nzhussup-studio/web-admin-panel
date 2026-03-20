import React from "react";
import { render, screen } from "@testing-library/react";
import UnauthorizedPage from "@/pages/errors/UnauthorizedPage";

jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({
    text,
    authActionLabel,
    showClearCacheButton,
  }: {
    text: string;
    authActionLabel?: string;
    showClearCacheButton?: boolean;
  }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement(
      "div",
      null,
      `Header: ${text} | ${authActionLabel} | ${String(showClearCacheButton)}`
    );
  },
}));

describe("pages/errors/UnauthorizedPage.tsx", () => {
  test("renders the unauthorized copy with header by default", () => {
    render(React.createElement(UnauthorizedPage));

    expect(
      screen.getByText("Header: Unauthorized | Login | false")
    ).toBeInTheDocument();
    expect(screen.getByText("403 - Unauthorized")).toBeInTheDocument();
    expect(
      screen.getByText("Your account does not have administrator access to this panel.")
    ).toBeInTheDocument();
  });

  test("can render without the standalone header", () => {
    render(React.createElement(UnauthorizedPage, { showHeader: false }));

    expect(
      screen.queryByText("Header: Unauthorized | Login | false")
    ).not.toBeInTheDocument();
    expect(screen.getByText("403 - Unauthorized")).toBeInTheDocument();
  });
});
