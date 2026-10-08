import { createElement, createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("preserves Bootstrap props, shared styling, events, and refs", async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      createElement(
        Button,
        { ref, variant: "success", className: "extra", onClick },
        "Save",
      ),
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveClass("app-button", "extra", "btn-success");
    expect(ref.current).toBe(button);
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
