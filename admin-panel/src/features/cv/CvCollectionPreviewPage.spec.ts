import { describe, expect, it } from "vitest";

describe("CvCollectionPreviewPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CvCollectionPreviewPage");

    expect(subject).toBeDefined();
  });
});
