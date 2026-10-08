import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AlbumVisibilityBadge } from "./AlbumVisibilityBadge";

describe("AlbumVisibilityBadge", () => {
  it.each([
    ["private", "Private"],
    ["semi-public", "Semi-public"],
    ["public", "Public"],
  ])("renders %s visibility", (type, label) => {
    render(createElement(AlbumVisibilityBadge, { type }));
    expect(screen.getByText(label)).toBeVisible();
  });

  it("renders nothing for unknown visibility", () => {
    const { container } = render(
      createElement(AlbumVisibilityBadge, { type: "unknown" }),
    );
    expect(container).toBeEmptyDOMElement();
  });
});
