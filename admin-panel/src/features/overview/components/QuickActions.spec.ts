import { describe, expect, it } from "vitest";

describe("QuickActions", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./QuickActions");

    expect(subject).toBeDefined();
  });
});
