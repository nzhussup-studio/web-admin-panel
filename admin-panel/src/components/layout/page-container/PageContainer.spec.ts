import { describe, expect, it } from "vitest";

describe("PageContainer", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./PageContainer");

    expect(subject).toBeDefined();
  });
});
