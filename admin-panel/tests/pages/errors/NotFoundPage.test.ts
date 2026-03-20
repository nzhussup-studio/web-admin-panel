import React from "react";
import { render, screen } from "@testing-library/react";
import NotFoundPage from "@/pages/errors/NotFoundPage";

jest.mock("@/components/layout/Header", () => ({
  __esModule: true,
  default: ({
    text,
    titleContent,
  }: {
    text?: string;
    titleContent?: React.ReactNode;
  }) => {
    const ReactLocal = require("react");
    return ReactLocal.createElement(
      "div",
      null,
      titleContent ? "Header: custom title" : `Header: ${text}`,
    );
  },
}));

describe("pages/errors/NotFoundPage.tsx", () => {
  test("renders the not found header and copy", () => {
    render(React.createElement(NotFoundPage));

    expect(screen.getByText("Header: custom title")).toBeInTheDocument();
    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByText("The page you're looking for does not exist.")
    ).toBeInTheDocument();
  });
});
