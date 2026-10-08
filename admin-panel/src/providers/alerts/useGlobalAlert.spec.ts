import { describe, expect, it } from "vitest";

describe("useGlobalAlert", () => {
  it("loads its public module contract", async () => {
    const subject = await import("./useGlobalAlert");

    expect(subject).toBeDefined();
  });
});
