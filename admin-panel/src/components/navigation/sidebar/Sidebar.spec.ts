import { describe, expect, it } from "vitest";

describe("Sidebar", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./Sidebar");

    expect(subject).toBeDefined();
  });
});
