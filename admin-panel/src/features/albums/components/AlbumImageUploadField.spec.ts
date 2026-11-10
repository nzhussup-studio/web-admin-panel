import { describe, expect, it, vi } from "vitest";

vi.mock("heic-to/csp", () => ({
  heicTo: vi
    .fn()
    .mockResolvedValue(new Blob(["jpeg-preview"], { type: "image/jpeg" })),
}));

describe("AlbumImageUploadField", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AlbumImageUploadField");

    expect(subject).toBeDefined();
  });

  it("creates a JPEG preview while preserving HEIC for upload", async () => {
    const { createImagePreview } = await import("./imagePreview");
    const file = new File(["heic-image"], "photo.heic", {
      type: "image/heic",
      lastModified: 123,
    });

    const result = await createImagePreview(file);

    expect(result.file).toBe(file);
    expect(result.preview).toMatch(/^data:image\/jpeg;base64,/);
  });

  it("recognizes HEIF by extension and normalizes its upload content type", async () => {
    const { createImagePreview } = await import("./imagePreview");
    const file = new File(["heif-image"], "photo.heif", { type: "" });

    const result = await createImagePreview(file);

    expect(result.file.name).toBe("photo.heif");
    expect(result.file.type).toBe("image/heic");
    expect(result.preview).toMatch(/^data:image\/jpeg;base64,/);
  });
});
