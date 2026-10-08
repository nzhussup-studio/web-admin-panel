import { describe, expect, it } from "vitest";

describe("CvGeneratorPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CvGeneratorPage");

    expect(subject).toBeDefined();
  });
});
