import { describe, expect, it } from "vitest";

describe("llmMutations", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./llmMutations");

    expect(subject).toBeDefined();
  });
});
