import { describe, expect, it } from "vitest";

describe("generateCv", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./generateCv");

    expect(subject).toBeDefined();
  });
});
