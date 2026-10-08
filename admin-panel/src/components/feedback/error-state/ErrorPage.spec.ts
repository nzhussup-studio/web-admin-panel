import { describe, expect, it } from "vitest";

describe("ErrorPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./ErrorPage");

    expect(subject).toBeDefined();
  });
});
