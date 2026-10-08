import { describe, expect, it } from "vitest";

describe("PageHeader", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./PageHeader");

    expect(subject).toBeDefined();
  });
});
