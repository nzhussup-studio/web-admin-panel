import { describe, expect, it } from "vitest";

describe("global-alert-context", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./global-alert-context");

    expect(subject).toBeDefined();
  });
});
