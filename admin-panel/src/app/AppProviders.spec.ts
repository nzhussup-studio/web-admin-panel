import { describe, expect, it } from "vitest";

describe("AppProviders", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AppProviders");

    expect(subject).toBeDefined();
  });
});
