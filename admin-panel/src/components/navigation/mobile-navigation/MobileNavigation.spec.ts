import { describe, expect, it } from "vitest";

describe("MobileNavigation", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./MobileNavigation");

    expect(subject).toBeDefined();
  });
});
