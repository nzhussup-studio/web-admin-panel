import { describe, expect, it } from "vitest";

describe("GlobalAlertProvider", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./GlobalAlertProvider");

    expect(subject).toBeDefined();
  });
});
