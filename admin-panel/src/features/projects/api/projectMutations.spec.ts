import { describe, expect, it } from "vitest";

describe("projectMutations", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./projectMutations");

    expect(subject).toBeDefined();
  });
});
