import { describe, expect, it } from "vitest";

describe("AlbumImageUploadField", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AlbumImageUploadField");

    expect(subject).toBeDefined();
  });
});
