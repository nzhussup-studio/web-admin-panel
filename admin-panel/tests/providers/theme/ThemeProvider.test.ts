import React, { useContext } from "react";
import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/providers/theme/ThemeProvider";
import { ThemeContext } from "@/providers/theme/theme-context";

const Consumer = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    return null;
  }

  return React.createElement(
    "div",
    null,
    React.createElement(
      "span",
      { "data-testid": "theme-state" },
      context.isDarkMode ? "dark" : "light"
    ),
    React.createElement(
      "button",
      {
        type: "button",
        onClick: context.toggleDarkMode,
      },
      "toggle"
    )
  );
};

describe("providers/theme/ThemeProvider.tsx", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = "";
    document.documentElement.removeAttribute("data-bs-theme");
  });

  test("hydrates from localStorage and applies dark mode attributes", () => {
    localStorage.setItem("isDarkMode", "true");

    render(React.createElement(ThemeProvider, null, React.createElement(Consumer)));

    expect(screen.getByTestId("theme-state")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveAttribute("data-bs-theme", "dark");
    expect(document.body).toHaveClass("dark-mode");
  });

  test("toggles theme and persists the new mode", () => {
    render(React.createElement(ThemeProvider, null, React.createElement(Consumer)));

    expect(screen.getByTestId("theme-state")).toHaveTextContent("light");

    act(() => {
      screen.getByText("toggle").click();
    });

    expect(screen.getByTestId("theme-state")).toHaveTextContent("dark");
    expect(localStorage.getItem("isDarkMode")).toBe("true");
    expect(document.documentElement).toHaveAttribute("data-bs-theme", "dark");
  });
});
