import { describe, expect, it } from "vitest";

describe("MetricGrid", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./MetricGrid");

    expect(subject).toBeDefined();
  });
});
