import { describe, expect, it } from "vitest";

describe("PreviewPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./PreviewPage");

    expect(subject).toBeDefined();
  });
});
