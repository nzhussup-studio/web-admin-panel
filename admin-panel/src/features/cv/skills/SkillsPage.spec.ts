import { describe, expect, it } from "vitest";

describe("SkillsPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./SkillsPage");

    expect(subject).toBeDefined();
  });
});
