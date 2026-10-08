import { describe, expect, it } from "vitest";

describe("albumMutations", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./albumMutations");

    expect(subject).toBeDefined();
  });
});
