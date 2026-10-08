import { describe, expect, it } from "vitest";

describe("ErrorBoundary", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ErrorBoundary");

    expect(subject).toBeDefined();
  });
});
