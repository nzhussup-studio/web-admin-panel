import { describe, expect, it } from "vitest";

describe("OverflowMenu", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./OverflowMenu");

    expect(subject).toBeDefined();
  });
});
