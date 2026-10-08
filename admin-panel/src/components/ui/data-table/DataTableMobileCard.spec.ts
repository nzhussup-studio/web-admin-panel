import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTableMobileCard } from "./DataTableMobileCard";

describe("DataTableMobileCard", () => {
  it("renders a shared mobile record hierarchy", () => {
    render(
      createElement(
        "table",
        null,
        createElement(
          "tbody",
          null,
          createElement(
            "tr",
            null,
            createElement(
              DataTableMobileCard,
              {
                colSpan: 4,
                title: "Engineer",
                subtitle: "NZ Studio",
                metadata: [
                  { label: "Period", value: "2024 – Present" },
                  { label: "Order", value: 1 },
                ],
                actions: createElement("button", null, "Actions"),
              },
              createElement("span", null, "React"),
            ),
          ),
        ),
      ),
    );

    expect(screen.getByText("Engineer")).toBeVisible();
    expect(screen.getByText("NZ Studio")).toBeVisible();
    expect(screen.getByText("React")).toBeVisible();
    expect(screen.getByText("2024 – Present")).toBeVisible();
    expect(screen.getByRole("button", { name: "Actions" })).toBeVisible();
  });
});
