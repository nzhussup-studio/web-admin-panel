import { describe, expect, it } from "vitest";

describe("accountMutations", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./accountMutations");

    expect(subject).toBeDefined();
  });
});
