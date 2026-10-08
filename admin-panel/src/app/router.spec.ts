import { describe, expect, it } from "vitest";

describe("router", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./router");

    expect(subject).toBeDefined();
  });
});
