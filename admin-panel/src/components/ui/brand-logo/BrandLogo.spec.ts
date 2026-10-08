import { describe, expect, it } from "vitest";

describe("BrandLogo", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./BrandLogo");

    expect(subject).toBeDefined();
  });
});
