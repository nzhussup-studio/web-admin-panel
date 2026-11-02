import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ImageMenu from "./ImageMenu";

const { triggerAlert } = vi.hoisted(() => ({ triggerAlert: vi.fn() }));

vi.mock("@/providers/alerts", () => ({
  useGlobalAlert: () => ({ triggerAlert }),
}));

describe("ImageMenu", () => {
  it("copies the permanent public URL instead of the preview Blob URL", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    render(
      createElement(ImageMenu, {
        imageUrl: "blob:http://localhost/private-preview",
        copyUrl: "https://api.example/v1/albums/album/images/photo.jpg",
        imageId: "photo.jpg",
      }),
    );

    await user.click(screen.getByRole("button", { name: /actions for/i }));
    await user.click(screen.getByRole("button", { name: "Copy public URL" }));

    expect(writeText).toHaveBeenCalledWith(
      "https://api.example/v1/albums/album/images/photo.jpg",
    );
    expect(triggerAlert).toHaveBeenCalledWith("Image URL copied", "success");
  });

  it("does not offer URL copying for a private image", async () => {
    const user = userEvent.setup();
    render(
      createElement(ImageMenu, {
        imageUrl: "blob:http://localhost/private-preview",
        imageId: "private.jpg",
        onEdit: vi.fn(),
      }),
    );

    await user.click(screen.getByRole("button", { name: /actions for/i }));

    expect(
      screen.queryByRole("button", { name: /copy public url/i }),
    ).not.toBeInTheDocument();
  });
});
