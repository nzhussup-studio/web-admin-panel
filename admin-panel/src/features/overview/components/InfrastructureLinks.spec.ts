import { describe, expect, it } from "vitest";

describe("InfrastructureLinks", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./InfrastructureLinks");

    expect(subject).toBeDefined();
  });
});
