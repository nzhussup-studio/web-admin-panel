import { describe, expect, it } from "vitest";

describe("LlmConfigPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./LlmConfigPage");

    expect(subject).toBeDefined();
  });
});
