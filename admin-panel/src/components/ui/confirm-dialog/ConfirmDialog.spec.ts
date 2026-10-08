import { describe, expect, it } from "vitest";

describe("ConfirmDialog", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ConfirmDialog");

    expect(subject).toBeDefined();
  });
});
