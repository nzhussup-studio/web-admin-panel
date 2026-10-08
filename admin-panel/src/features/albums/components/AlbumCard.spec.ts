import { describe, expect, it } from "vitest";

describe("AlbumCard", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AlbumCard");

    expect(subject).toBeDefined();
  });
});
