import { describe, expect, it } from "vitest";

describe("AlbumForm", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AlbumForm");

    expect(subject).toBeDefined();
  });
});
