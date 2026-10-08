import { describe, expect, it } from "vitest";

describe("AsyncState", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AsyncState");

    expect(subject).toBeDefined();
  });
});
