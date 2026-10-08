import { describe, expect, it } from "vitest";

describe("auth-context", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./auth-context");

    expect(subject).toBeDefined();
  });
});
