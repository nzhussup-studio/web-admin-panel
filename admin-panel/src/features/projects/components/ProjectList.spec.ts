import { describe, expect, it } from "vitest";

describe("ProjectList", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ProjectList");

    expect(subject).toBeDefined();
  });
});
