import { describe, expect, it } from "vitest";

describe("CvEntryList", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CvEntryList");

    expect(subject).toBeDefined();
  });
});
