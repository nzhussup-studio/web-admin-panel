import { describe, expect, it } from "vitest";

describe("AuthProvider", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./AuthProvider");

    expect(subject).toBeDefined();
  });
});
