import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders defaults and optional copy", () => {
    const { rerender } = render(createElement(EmptyState));
    expect(
      screen.getByRole("heading", { name: "No information found." }),
    ).toBeVisible();
    rerender(
      createElement(EmptyState, {
        title: "No projects",
        description: "Create one.",
      }),
    );
    expect(screen.getByText("Create one.")).toBeVisible();
  });
});
