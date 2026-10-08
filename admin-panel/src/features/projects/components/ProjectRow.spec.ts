import { describe, expect, it } from "vitest";

describe("ProjectRow", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ProjectRow");

    expect(subject).toBeDefined();
  });
});
