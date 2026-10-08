import { describe, expect, it } from "vitest";

describe("overviewQueries", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./overviewQueries");

    expect(subject).toBeDefined();
  });
});
