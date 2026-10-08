import { describe, expect, it } from "vitest";

describe("AccountMenu", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AccountMenu");

    expect(subject).toBeDefined();
  });
});
