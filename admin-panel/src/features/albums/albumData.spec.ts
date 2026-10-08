import { describe, expect, it } from "vitest";
import { API_BASE } from "@/api";
import { getAlbumImageUrl, normalizeAlbumPreview } from "./albumData";

describe("albumData", () => {
  it("maps API names to view names", () => {
    expect(
      normalizeAlbumPreview({
        title: "Vienna",
        type: "public",
        desc: "Trip",
        image_count: 6,
      }),
    ).toMatchObject({
      description: "Trip",
      images_count: 6,
    });
  });

  it("preserves complete image URLs", () => {
    expect(getAlbumImageUrl(" https://cdn.example/photo.png ")).toBe(
      "https://cdn.example/photo.png",
    );
    expect(getAlbumImageUrl("data:image/png;base64,abc")).toBe(
      "data:image/png;base64,abc",
    );
  });

  it("joins relative paths to the API base without duplicate slashes", () => {
    expect(getAlbumImageUrl("/v1/album/photo.png")).toBe(
      `${API_BASE.replace(/\/+$/, "")}/v1/album/photo.png`,
    );
    expect(getAlbumImageUrl("  ")).toBe("");
  });
});
