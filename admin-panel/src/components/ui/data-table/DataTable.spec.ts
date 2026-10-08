import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "./DataTable";

describe("DataTable", () => {
  it("renders columns and delegates sorting", async () => {
    const onSort = vi.fn();
    render(
      createElement(
        DataTable,
        {
          columns: [
            { key: "name", label: "Name", width: "70%" },
            { key: "order", label: "Order", sortable: true },
          ],
          sortDirection: "asc",
          onSort,
        } as unknown as Parameters<typeof DataTable>[0],
        createElement(
          "tr",
          null,
          createElement("td", null, "Portfolio"),
          createElement("td", null, "1"),
        ),
      ),
    );

    expect(screen.getByText("Portfolio")).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Sort by Order descending" }),
    );
    expect(onSort).toHaveBeenCalledOnce();
  });
});
