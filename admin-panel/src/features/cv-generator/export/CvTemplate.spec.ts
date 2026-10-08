import { describe, expect, it } from "vitest";

describe("CvTemplate", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CvTemplate");

    expect(subject).toBeDefined();
  });
});
