import { describe, expect, it } from "vitest";

describe("SummaryTester", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./SummaryTester");

    expect(subject).toBeDefined();
  });
});
