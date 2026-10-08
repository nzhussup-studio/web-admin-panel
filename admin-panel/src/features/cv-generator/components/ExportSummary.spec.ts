import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ExportSummary } from "./ExportSummary";

describe("ExportSummary", () => {
  it("summarizes selected items and generates from mobile or desktop", async () => {
    const onGenerate = vi.fn();
    render(
      createElement(ExportSummary, {
        counts: { basic_info: 1, work_experience: 2, education: 1 },
        onGenerate,
      }),
    );

    expect(screen.getByText("4")).toBeVisible();
    expect(screen.getByText(/items selected/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Standard" })).toBeVisible();
    await userEvent.click(
      screen.getAllByRole("button", { name: "Generate CV" })[0],
    );
    expect(onGenerate).toHaveBeenCalledOnce();
  });
});
