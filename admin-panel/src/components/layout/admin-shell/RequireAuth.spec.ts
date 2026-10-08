import { describe, expect, it } from "vitest";

describe("RequireAuth", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./RequireAuth");

    expect(subject).toBeDefined();
  });
});
