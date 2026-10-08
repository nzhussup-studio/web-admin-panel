import { describe, expect, it } from "vitest";

describe("CvGeneratorBasicInfoCard", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CvGeneratorBasicInfoCard");

    expect(subject).toBeDefined();
  });
});
