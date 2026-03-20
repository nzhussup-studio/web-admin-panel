import React from "react";
import { act, render, screen } from "@testing-library/react";
import PageState from "@/components/pages/PageState";

jest.useFakeTimers();
const mockCreateElement = React.createElement;

jest.mock("@/components/states/LoadingState", () => ({
  __esModule: true,
  default: () => mockCreateElement("div", null, "Loading state"),
}));
jest.mock("@/pages/errors/UnauthorizedPage", () => ({
  __esModule: true,
  default: ({ showHeader }: { showHeader?: boolean }) =>
    mockCreateElement("div", null, `Unauthorized page ${String(showHeader)}`),
}));

describe("components/pages/PageState.tsx", () => {
  test("renders loading state when loading", () => {
    render(
      mockCreateElement(PageState, {
        isEmpty: false,
        loading: true,
        error: null,
        children: mockCreateElement("div", null, "Children"),
      })
    );

    expect(screen.getByText("Loading state")).toBeInTheDocument();
  });

  test("renders 401, 404 and generic error states", () => {
    const { rerender } = render(
      mockCreateElement(PageState, {
        isEmpty: false,
        loading: false,
        error: { status: 401 },
        children: mockCreateElement("div", null, "Children"),
      })
    );
    expect(screen.getByText("Unauthorized page")).toBeInTheDocument();
    expect(screen.getByText("Unauthorized page false")).toBeInTheDocument();

    rerender(
      mockCreateElement(PageState, {
        isEmpty: false,
        loading: false,
        error: { status: 404 },
        children: mockCreateElement("div", null, "Children"),
      })
    );
    expect(screen.getByText("404")).toBeInTheDocument();

    rerender(
      mockCreateElement(PageState, {
        isEmpty: false,
        loading: false,
        error: { status: 500, response: "Boom" },
        children: mockCreateElement("div", null, "Children"),
      })
    );
    expect(screen.getByText("500 - Internal Server Error")).toBeInTheDocument();
    expect(screen.getByText("Boom")).toBeInTheDocument();
  });

  test("delays empty state and otherwise renders children", () => {
    const { rerender } = render(
      mockCreateElement(PageState, {
        isEmpty: true,
        loading: false,
        error: null,
        delay: 500,
        children: mockCreateElement("div", null, "Children"),
      })
    );

    expect(screen.queryByText("No information found.")).not.toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(screen.getByText("No information found.")).toBeInTheDocument();

    rerender(
      mockCreateElement(PageState, {
        isEmpty: false,
        loading: false,
        error: null,
        children: mockCreateElement("div", null, "Children"),
      })
    );
    expect(screen.getByText("Children")).toBeInTheDocument();
  });
});
