import { describe, expect, it } from "vitest";

describe("cvMutations", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./cvMutations");

    expect(subject).toBeDefined();
  });
});
