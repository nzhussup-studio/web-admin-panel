import { describe, expect, it } from "vitest";

describe("AlbumDetailPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AlbumDetailPage");

    expect(subject).toBeDefined();
  });
});
