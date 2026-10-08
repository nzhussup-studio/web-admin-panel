import { describe, expect, it } from "vitest";

describe("workExperienceData", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./workExperienceData");

    expect(subject).toBeDefined();
  });
});
