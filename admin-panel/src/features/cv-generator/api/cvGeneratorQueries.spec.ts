import { describe, expect, it } from "vitest";

describe("cvGeneratorQueries", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./cvGeneratorQueries");

    expect(subject).toBeDefined();
  });
});
