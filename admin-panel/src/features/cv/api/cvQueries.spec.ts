import { describe, expect, it } from "vitest";

describe("cvQueries", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./cvQueries");

    expect(subject).toBeDefined();
  });
});
