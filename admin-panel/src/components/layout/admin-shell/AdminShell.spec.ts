import { describe, expect, it } from "vitest";

describe("AdminShell", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AdminShell");

    expect(subject).toBeDefined();
  });
});
