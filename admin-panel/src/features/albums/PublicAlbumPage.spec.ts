import { describe, expect, it } from "vitest";

describe("PublicAlbumPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./PublicAlbumPage");

    expect(subject).toBeDefined();
  });
});
