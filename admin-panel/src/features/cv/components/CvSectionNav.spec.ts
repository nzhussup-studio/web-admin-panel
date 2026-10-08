import { describe, expect, it } from "vitest";

describe("CvSectionNav", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CvSectionNav");

    expect(subject).toBeDefined();
  });
});
