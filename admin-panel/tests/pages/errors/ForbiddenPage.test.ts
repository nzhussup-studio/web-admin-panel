import React from "react";
import { render, screen } from "@testing-library/react";
import ForbiddenPage from "@/pages/errors/ForbiddenPage";

jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({
    text,
    titleContent,
    showClearCacheButton,
  }: {
    text?: string;
    titleContent?: React.ReactNode;
    showClearCacheButton?: boolean;
  }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement(
      "div",
      null,
      titleContent
        ? `Header: custom title | ${String(showClearCacheButton)}`
        : `Header: ${text} | ${String(showClearCacheButton)}`
    );
  },
}));

describe("pages/errors/ForbiddenPage.tsx", () => {
  test("renders the forbidden copy with header by default", () => {
    render(React.createElement(ForbiddenPage));

    expect(
      screen.getByText("Header: custom title | false")
    ).toBeInTheDocument();
    expect(screen.getByText("403 - Forbidden")).toBeInTheDocument();
    expect(
      screen.getByText("Your account does not have administrator access to this panel.")
    ).toBeInTheDocument();
  });

  test("can render without the standalone header", () => {
    render(React.createElement(ForbiddenPage, { showHeader: false }));

    expect(
      screen.queryByText("Header: custom title | false")
    ).not.toBeInTheDocument();
    expect(screen.getByText("403 - Forbidden")).toBeInTheDocument();
  });
});
