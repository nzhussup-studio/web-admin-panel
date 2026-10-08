import { describe, expect, it } from "vitest";

describe("ResourceForm", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ResourceForm");

    expect(subject).toBeDefined();
  });
});
