import { describe, expect, it } from "vitest";

describe("theme-context", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./theme-context");

    expect(subject).toBeDefined();
  });
});
