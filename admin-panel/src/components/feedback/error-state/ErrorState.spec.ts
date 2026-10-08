import { describe, expect, it } from "vitest";

describe("ErrorState", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ErrorState");

    expect(subject).toBeDefined();
  });
});
