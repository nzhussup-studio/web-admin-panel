import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColorPills } from "./ColorPills";

describe("ColorPills", () => {
  it("trims values, removes empty entries, and assigns known tones", () => {
    render(createElement(ColorPills, { values: "React, , Redis" }));

    expect(screen.getByText("React")).toHaveClass("data-pill-blue");
    expect(screen.getByText("Redis")).toHaveClass("data-pill-red");
    expect(screen.getAllByText(/React|Redis/)).toHaveLength(2);
  });

  it("supports arrays and custom separators", () => {
    const { rerender } = render(
      createElement(ColorPills, { values: ["Go", "Unknown"] }),
    );
    expect(screen.getByText("Go")).toHaveClass("data-pill-cyan");
    rerender(createElement(ColorPills, { values: "Go|Java", separator: "|" }));
    expect(screen.getByText("Java")).toBeVisible();
  });
});
