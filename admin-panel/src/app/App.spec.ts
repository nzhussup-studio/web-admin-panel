import { describe, expect, it } from "vitest";

describe("App", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./App");

    expect(subject).toBeDefined();
  });
});
