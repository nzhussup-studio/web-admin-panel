import { describe, expect, it } from "vitest";

describe("ExportSummary", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ExportSummary");

    expect(subject).toBeDefined();
  });
});
