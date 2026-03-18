import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DarkModeToggle from "@/components/shared/DarkModeToggle";
import { ThemeProvider } from "@/providers/theme/ThemeProvider";

describe("DarkModeToggle Component", () => {
  const renderWithProvider = () => {
    return render(
      <ThemeProvider>
        <DarkModeToggle />
      </ThemeProvider>
    );
  };

  test("renders toggle switch", () => {
    renderWithProvider();
    const toggle = screen.getByRole("checkbox");
    expect(toggle).toBeInTheDocument();
  });

  test("toggles mode when clicked", () => {
    renderWithProvider();
    const toggle = screen.getByRole("checkbox");

    // Initial state (light mode)
    expect(localStorage.getItem("isDarkMode")).toBe("false");

    // Click to toggle
    fireEvent.click(toggle);
    expect(localStorage.getItem("isDarkMode")).toBe("true");

    // Click again to toggle back
    fireEvent.click(toggle);
    expect(localStorage.getItem("isDarkMode")).toBe("false");
  });
});
