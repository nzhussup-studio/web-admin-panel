import { describe, expect, it } from "vitest";

describe("OverviewPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./OverviewPage");

    expect(subject).toBeDefined();
  });
});
