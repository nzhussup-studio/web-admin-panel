import { describe, expect, it } from "vitest";

describe("useAuth", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./useAuth");

    expect(subject).toBeDefined();
  });
});
