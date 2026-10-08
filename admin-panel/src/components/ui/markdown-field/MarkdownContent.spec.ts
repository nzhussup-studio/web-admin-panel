import { describe, expect, it } from "vitest";

describe("MarkdownContent", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./MarkdownContent");

    expect(subject).toBeDefined();
  });
});
