import { describe, expect, it } from "vitest";

describe("ThemeProvider", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ThemeProvider");

    expect(subject).toBeDefined();
  });
});
