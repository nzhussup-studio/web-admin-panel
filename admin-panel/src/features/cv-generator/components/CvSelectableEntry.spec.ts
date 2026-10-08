import { describe, expect, it } from "vitest";

describe("CvSelectableEntry", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CvSelectableEntry");

    expect(subject).toBeDefined();
  });
});
