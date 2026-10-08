import { describe, expect, it } from "vitest";

describe("ImageGrid", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ImageGrid");

    expect(subject).toBeDefined();
  });
});
