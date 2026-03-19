import React from "react";
import { render, screen } from "@testing-library/react";
import PageTransition from "@/motion/PageTransition";

const mockMotionDiv = jest.fn(
  ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) =>
    React.createElement(
      "div",
      {
        "data-testid": "motion-div",
        "data-initial": props.initial,
        "data-animate": props.animate,
        "data-exit": props.exit,
      },
      children
    )
);

jest.mock("framer-motion", () => ({
  motion: {
    div: (props: unknown) => mockMotionDiv(props as never),
  },
}));

describe("motion/PageTransition.tsx", () => {
  beforeEach(() => {
    mockMotionDiv.mockClear();
  });

  test("renders children inside the motion wrapper", () => {
    render(
      React.createElement(
        PageTransition,
        null,
        React.createElement("div", null, "Animated content")
      )
    );

    expect(screen.getByText("Animated content")).toBeInTheDocument();
    expect(screen.getByTestId("motion-div")).toHaveAttribute(
      "data-initial",
      "initial"
    );
  });

  test("passes the expected animation variants and transition props", () => {
    render(
      React.createElement(
        PageTransition,
        null,
        React.createElement("div", null, "Animated content")
      )
    );

    const props = mockMotionDiv.mock.calls[0][0] as {
      variants: Record<string, { opacity: number; transform: string }>;
      transition: { duration: number; ease: string };
      style: { willChange: string };
    };

    expect(props.variants.initial).toMatchObject({
      opacity: 0,
      transform: "translateY(20px)",
    });
    expect(props.variants.animate).toMatchObject({
      opacity: 1,
      transform: "translateY(0)",
    });
    expect(props.variants.exit).toMatchObject({
      opacity: 0,
      transform: "translateY(-20px)",
    });
    expect(props.transition).toEqual({
      duration: 0.5,
      ease: "easeInOut",
    });
    expect(props.style).toEqual({ willChange: "transform, opacity" });
  });

  test("sets a stable display name on the memoized component", () => {
    expect(PageTransition.displayName).toBe("PageTransition");
  });
});
