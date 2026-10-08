import { describe, expect, it } from "vitest";

describe("WorkExperiencePage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./WorkExperiencePage");

    expect(subject).toBeDefined();
  });
});
