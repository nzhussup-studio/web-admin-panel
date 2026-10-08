import { describe, expect, it } from "vitest";

describe("cvGeneratorPreferences", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./cvGeneratorPreferences");

    expect(subject).toBeDefined();
  });
});
