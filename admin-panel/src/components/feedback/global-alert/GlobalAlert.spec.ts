import { describe, expect, it } from "vitest";

describe("GlobalAlert", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./GlobalAlert");

    expect(subject).toBeDefined();
  });
});
