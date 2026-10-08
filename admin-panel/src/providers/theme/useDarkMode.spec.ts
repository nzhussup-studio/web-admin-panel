import { describe, expect, it } from "vitest";

describe("useDarkMode", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./useDarkMode");

    expect(subject).toBeDefined();
  });
});
