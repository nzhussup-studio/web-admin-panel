import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UploadProgress } from "./UploadProgress";

describe("UploadProgress", () => {
  it("shows progress and completion state", () => {
    const { rerender } = render(
      createElement(UploadProgress, {
        completed: 1,
        total: 4,
        status: "processing",
      }),
    );
    expect(screen.getByText("25%")).toBeVisible();
    expect(screen.getByText("Uploading 4 images")).toBeVisible();
    rerender(
      createElement(UploadProgress, {
        completed: 4,
        total: 4,
        status: "completed",
      }),
    );
    expect(screen.getByText("Images uploaded")).toBeVisible();
    expect(screen.getByText("100%")).toBeVisible();
  });

  it("avoids division by zero", () => {
    render(
      createElement(UploadProgress, {
        completed: 0,
        total: 0,
        status: "queued",
      }),
    );
    expect(screen.getByText("0%")).toBeVisible();
  });
});
