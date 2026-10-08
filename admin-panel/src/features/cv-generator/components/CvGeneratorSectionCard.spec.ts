import { describe, expect, it } from "vitest";

describe("CvGeneratorSectionCard", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CvGeneratorSectionCard");

    expect(subject).toBeDefined();
  });
});
