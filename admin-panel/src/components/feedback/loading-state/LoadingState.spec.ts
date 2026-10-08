import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingState from "./LoadingState";

describe("LoadingState", () => {
  it("announces loading and supports full-page presentation", () => {
    const { container } = render(
      createElement(LoadingState, {
        title: "Loading albums",
        message: "One moment",
        fullPage: true,
      }),
    );
    const state = container.querySelector("section");
    expect(state).not.toBeNull();
    expect(state).toHaveAttribute("aria-busy", "true");
    expect(state).toHaveClass("loading-state-page");
    expect(screen.getByText("Loading albums")).toBeVisible();
  });
});
