import { describe, expect, it } from "vitest";

describe("CvGeneratorItemLabel", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CvGeneratorItemLabel");

    expect(subject).toBeDefined();
  });
});
