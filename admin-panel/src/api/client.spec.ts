import { describe, expect, it } from "vitest";

describe("client", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./client");

    expect(subject).toBeDefined();
  });
});
