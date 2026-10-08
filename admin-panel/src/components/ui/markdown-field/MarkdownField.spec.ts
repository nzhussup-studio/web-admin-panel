import { describe, expect, it } from "vitest";

describe("MarkdownField", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./MarkdownField");

    expect(subject).toBeDefined();
  });
});
