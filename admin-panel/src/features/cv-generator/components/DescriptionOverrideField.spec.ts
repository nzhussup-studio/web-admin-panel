import { describe, expect, it } from "vitest";

describe("DescriptionOverrideField", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./DescriptionOverrideField");

    expect(subject).toBeDefined();
  });
});
