import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ThemeToggle from "@/components/shared/ThemeToggle";

const h = React.createElement;

describe("components/shared/ThemeToggle.tsx", () => {
  test("renders light mode state and toggles on click", () => {
    const onToggle = jest.fn();
    render(h(ThemeToggle, { isDarkMode: false, onToggle }));

    const button = screen.getByRole("button", { name: "Activate dark mode" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalled();
  });

  test("renders dark mode state and supports custom className", () => {
    render(h(ThemeToggle, { isDarkMode: true, onToggle: jest.fn(), className: "custom" }));

    const button = screen.getByRole("button", { name: "Activate light mode" });
    expect(button).toHaveClass("custom");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
