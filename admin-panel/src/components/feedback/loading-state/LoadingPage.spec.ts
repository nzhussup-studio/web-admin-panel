import { describe, expect, it } from "vitest";

describe("LoadingPage", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./LoadingPage");

    expect(subject).toBeDefined();
  });
});
