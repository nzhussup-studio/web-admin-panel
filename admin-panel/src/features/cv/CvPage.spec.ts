import { describe, expect, it } from "vitest";

describe("CvPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./CvPage");

    expect(subject).toBeDefined();
  });
});
