import { describe, expect, it } from "vitest";

describe("AlbumLightboxModal", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AlbumLightboxModal");

    expect(subject).toBeDefined();
  });
});
