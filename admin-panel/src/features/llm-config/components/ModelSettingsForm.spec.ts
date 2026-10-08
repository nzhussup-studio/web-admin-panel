import { describe, expect, it } from "vitest";

describe("ModelSettingsForm", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ModelSettingsForm");

    expect(subject).toBeDefined();
  });
});
