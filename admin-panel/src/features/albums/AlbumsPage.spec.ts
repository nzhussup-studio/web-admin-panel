import { describe, expect, it } from "vitest";

describe("AlbumsPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AlbumsPage");

    expect(subject).toBeDefined();
  });
});
