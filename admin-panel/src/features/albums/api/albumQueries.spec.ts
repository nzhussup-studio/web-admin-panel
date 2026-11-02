import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAuthenticatedBlob, getAlbum, getPublicAlbumRequest } = vi.hoisted(
  () => ({
    getAuthenticatedBlob: vi.fn(),
    getAlbum: vi.fn(),
    getPublicAlbumRequest: vi.fn(),
  }),
);

vi.mock("@/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/api")>()),
  getAuthenticatedBlob,
  AlbumService: {
    getV1AdminAlbums1: getAlbum,
  },
  PublicAlbumService: {
    getV1Albums1: getPublicAlbumRequest,
  },
}));

describe("albumQueries", () => {
  beforeEach(() => {
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:admin-image"),
    });
  });

  it("creates authenticated image URLs from binary responses", async () => {
    const blob = new Blob(["image"], { type: "image/jpeg" });
    getAuthenticatedBlob.mockResolvedValue(blob);
    getAlbum.mockResolvedValue({
      data: {
        id: "album/id",
        images: [{ id: "image id", url: "/old-url" }],
      },
    });

    const { getAlbum: loadAlbum } = await import("./albumQueries");
    const album = await loadAlbum("album/id");

    expect(getAuthenticatedBlob).toHaveBeenCalledWith(
      "/v1/admin/albums/album%2Fid/images/image%20id",
    );
    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
    expect(album?.images?.[0].url).toBe("blob:admin-image");
  });

  it("loads shareable albums through the public endpoint", async () => {
    getPublicAlbumRequest.mockResolvedValue({
      data: { id: "shared-album", type: "semi-public", images: [] },
    });

    const { getPublicAlbum } = await import("./albumQueries");
    const album = await getPublicAlbum("shared-album");

    expect(getPublicAlbumRequest).toHaveBeenCalledWith("shared-album");
    expect(album?.type).toBe("semi-public");
  });
});
