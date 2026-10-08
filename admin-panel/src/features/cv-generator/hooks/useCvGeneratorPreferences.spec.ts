import { describe, expect, it } from "vitest";

describe("useCvGeneratorPreferences", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./useCvGeneratorPreferences");

    expect(subject).toBeDefined();
  });
});
